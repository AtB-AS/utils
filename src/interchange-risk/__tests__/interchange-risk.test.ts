import {
  getInterchangeRisk,
  getLegInterchangeRisk,
  isTransitLeg,
  UNLIKELY_INTERCHANGE_LIMIT_IN_SECONDS,
  type InterchangeLeg,
} from '..';

const transitLeg = (
  overrides: Partial<InterchangeLeg> = {},
): InterchangeLeg => ({
  aimedStartTime: '2024-01-01T10:00:00.000Z',
  expectedStartTime: '2024-01-01T10:00:00.000Z',
  expectedEndTime: '2024-01-01T10:10:00.000Z',
  serviceJourney: {id: 'ATB:ServiceJourney:1'},
  ...overrides,
});

const footLeg = (overrides: Partial<InterchangeLeg> = {}): InterchangeLeg => ({
  aimedStartTime: '2024-01-01T10:10:00.000Z',
  expectedStartTime: '2024-01-01T10:10:00.000Z',
  expectedEndTime: '2024-01-01T10:15:00.000Z',
  serviceJourney: null,
  ...overrides,
});

describe('getInterchangeRisk', () => {
  it('passes when there is time to spare', () => {
    expect(getInterchangeRisk(1)).toBeUndefined();
    expect(getInterchangeRisk(600)).toBeUndefined();
  });

  it('treats a zero gap as uncertain', () => {
    expect(getInterchangeRisk(0)).toBe('uncertain');
  });

  it('is uncertain down to the unlikely limit', () => {
    expect(getInterchangeRisk(-60)).toBe('uncertain');
    expect(getInterchangeRisk(UNLIKELY_INTERCHANGE_LIMIT_IN_SECONDS)).toBe(
      'uncertain',
    );
  });

  it('is unlikely past the limit', () => {
    expect(getInterchangeRisk(UNLIKELY_INTERCHANGE_LIMIT_IN_SECONDS - 1)).toBe(
      'unlikely',
    );
    expect(getInterchangeRisk(-600)).toBe('unlikely');
  });

  it('passes when the gap is not a finite number', () => {
    expect(getInterchangeRisk(NaN)).toBeUndefined();
  });
});

describe('isTransitLeg', () => {
  it('distinguishes scheduled transit from walking', () => {
    expect(isTransitLeg(transitLeg())).toBe(true);
    expect(isTransitLeg(footLeg())).toBe(false);
    expect(isTransitLeg(transitLeg({serviceJourney: undefined}))).toBe(false);
  });
});

describe('getLegInterchangeRisk', () => {
  it('catches a missed interchange between two transit legs', () => {
    const legs = [
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      transitLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
    ];
    expect(getLegInterchangeRisk(legs, 1)).toBe('uncertain');
  });

  it('reports unlikely once the gap is past the limit', () => {
    const legs = [
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      transitLeg({expectedStartTime: '2024-01-01T10:05:00.000Z'}),
    ];
    expect(getLegInterchangeRisk(legs, 1)).toBe('unlikely');
  });

  it('passes when there is time to spare', () => {
    const legs = [
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      transitLeg({expectedStartTime: '2024-01-01T10:15:00.000Z'}),
    ];
    expect(getLegInterchangeRisk(legs, 1)).toBeUndefined();
  });

  it('passes on the first leg, which nothing precedes', () => {
    expect(
      getLegInterchangeRisk([transitLeg(), transitLeg()], 0),
    ).toBeUndefined();
  });

  it('passes on an index outside the trip', () => {
    expect(getLegInterchangeRisk([transitLeg()], 5)).toBeUndefined();
  });

  it('passes on a non-transit leg, so a walk carries no warning', () => {
    const legs = [
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      footLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
    ];
    expect(getLegInterchangeRisk(legs, 1)).toBeUndefined();
  });

  it('passes when there is no transit leg to have arrived from', () => {
    const legs = [
      footLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      transitLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
    ];
    expect(getLegInterchangeRisk(legs, 1)).toBeUndefined();
  });

  it('measures the gap from the end of an intervening walk', () => {
    const legs = [
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      footLeg({
        expectedStartTime: '2024-01-01T10:10:00.000Z',
        expectedEndTime: '2024-01-01T10:15:00.000Z',
      }),
      transitLeg({expectedStartTime: '2024-01-01T10:11:00.000Z'}),
    ];
    expect(getLegInterchangeRisk(legs, 2)).toBe('unlikely');
  });

  it('passes when the gap is unparseable rather than inventing a risk', () => {
    const legs = [
      transitLeg({expectedEndTime: 'not-a-date'}),
      transitLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
    ];
    expect(getLegInterchangeRisk(legs, 1)).toBeUndefined();
  });

  describe('guaranteed interchange', () => {
    it('passes on a guaranteed interchange with no stated wait limit', () => {
      const legs = [
        transitLeg({
          expectedEndTime: '2024-01-01T10:10:00.000Z',
          interchangeTo: {guaranteed: true},
        }),
        transitLeg({expectedStartTime: '2024-01-01T10:00:00.000Z'}),
      ];
      expect(getLegInterchangeRisk(legs, 1)).toBeUndefined();
    });

    it('warns when the interchange is explicitly not guaranteed', () => {
      const legs = [
        transitLeg({
          expectedEndTime: '2024-01-01T10:10:00.000Z',
          interchangeTo: {guaranteed: false},
        }),
        transitLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
      ];
      expect(getLegInterchangeRisk(legs, 1)).toBe('uncertain');
    });

    it('passes on a guaranteed interchange reached through a walk', () => {
      const legs = [
        transitLeg({
          expectedEndTime: '2024-01-01T10:10:00.000Z',
          interchangeTo: {guaranteed: true},
        }),
        footLeg({
          expectedStartTime: '2024-01-01T10:10:00.000Z',
          expectedEndTime: '2024-01-01T10:15:00.000Z',
        }),
        transitLeg({expectedStartTime: '2024-01-01T10:11:00.000Z'}),
      ];
      expect(getLegInterchangeRisk(legs, 2)).toBeUndefined();
    });

    it('passes when arrival is within the maximum wait time', () => {
      const legs = [
        transitLeg({
          expectedEndTime: '2024-01-01T10:10:00.000Z',
          interchangeTo: {guaranteed: true, maximumWaitTime: 300},
        }),
        transitLeg({
          aimedStartTime: '2024-01-01T10:08:00.000Z',
          expectedStartTime: '2024-01-01T10:08:00.000Z',
        }),
      ];
      // Held until 10:08 + 5 min = 10:13, and we arrive at 10:10.
      expect(getLegInterchangeRisk(legs, 1)).toBeUndefined();
    });

    it('treats arrival exactly at the deadline as caught', () => {
      const legs = [
        transitLeg({
          expectedEndTime: '2024-01-01T10:13:00.000Z',
          interchangeTo: {guaranteed: true, maximumWaitTime: 300},
        }),
        transitLeg({
          aimedStartTime: '2024-01-01T10:08:00.000Z',
          expectedStartTime: '2024-01-01T10:08:00.000Z',
        }),
      ];
      expect(getLegInterchangeRisk(legs, 1)).toBeUndefined();
    });

    it('warns once arrival is past the maximum wait time', () => {
      const legs = [
        transitLeg({
          expectedEndTime: '2024-01-01T10:20:00.000Z',
          interchangeTo: {guaranteed: true, maximumWaitTime: 300},
        }),
        transitLeg({
          aimedStartTime: '2024-01-01T10:08:00.000Z',
          expectedStartTime: '2024-01-01T10:08:00.000Z',
        }),
      ];
      // Held until 10:13, but we do not arrive until 10:20.
      expect(getLegInterchangeRisk(legs, 1)).toBe('unlikely');
    });

    it('counts an intervening walk against the maximum wait time', () => {
      const legs = [
        transitLeg({
          expectedEndTime: '2024-01-01T10:10:00.000Z',
          interchangeTo: {guaranteed: true, maximumWaitTime: 120},
        }),
        footLeg({
          expectedStartTime: '2024-01-01T10:10:00.000Z',
          expectedEndTime: '2024-01-01T10:15:00.000Z',
        }),
        transitLeg({
          aimedStartTime: '2024-01-01T10:11:00.000Z',
          expectedStartTime: '2024-01-01T10:11:00.000Z',
        }),
      ];
      // Held until 10:13, but the walk does not end until 10:15.
      expect(getLegInterchangeRisk(legs, 2)).toBe('unlikely');
    });

    it('keeps the guarantee when the deadline is unparseable', () => {
      const legs = [
        transitLeg({
          expectedEndTime: '2024-01-01T10:20:00.000Z',
          interchangeTo: {guaranteed: true, maximumWaitTime: 300},
        }),
        transitLeg({
          aimedStartTime: 'not-a-date',
          expectedStartTime: '2024-01-01T10:08:00.000Z',
        }),
      ];
      expect(getLegInterchangeRisk(legs, 1)).toBeUndefined();
    });
  });
});
