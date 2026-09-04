import {
  getTransferRisk,
  getLegTransferRisk,
  getTripTransferRisk,
  withTransferRisk,
  isTransitLeg,
  TransferRisk,
  type TransferLeg,
} from '..';

/** A leg that can carry a stamped risk, as every real consumer's leg can. */
type TestLeg = TransferLeg & {transferRisk?: TransferRisk};

const transitLeg = (overrides: Partial<TestLeg> = {}): TestLeg => ({
  aimedStartTime: '2024-01-01T10:00:00.000Z',
  expectedStartTime: '2024-01-01T10:00:00.000Z',
  expectedEndTime: '2024-01-01T10:10:00.000Z',
  serviceJourney: {id: 'ATB:ServiceJourney:1'},
  ...overrides,
});

const footLeg = (overrides: Partial<TestLeg> = {}): TestLeg => ({
  aimedStartTime: '2024-01-01T10:10:00.000Z',
  expectedStartTime: '2024-01-01T10:10:00.000Z',
  expectedEndTime: '2024-01-01T10:15:00.000Z',
  serviceJourney: null,
  ...overrides,
});

describe('getTransferRisk', () => {
  it('passes when there is time to spare', () => {
    expect(getTransferRisk(1)).toBeUndefined();
    expect(getTransferRisk(600)).toBeUndefined();
  });

  it('treats a zero gap as uncertain', () => {
    expect(getTransferRisk(0)).toBe('uncertain');
  });

  it('is uncertain at any negative gap, however large', () => {
    expect(getTransferRisk(-1)).toBe('uncertain');
    expect(getTransferRisk(-60)).toBe('uncertain');
    expect(getTransferRisk(-600)).toBe('uncertain');
  });

  it('passes when the gap is not a finite number', () => {
    expect(getTransferRisk(NaN)).toBeUndefined();
  });
});

describe('isTransitLeg', () => {
  it('distinguishes scheduled transit from walking', () => {
    expect(isTransitLeg(transitLeg())).toBe(true);
    expect(isTransitLeg(footLeg())).toBe(false);
    expect(isTransitLeg(transitLeg({serviceJourney: undefined}))).toBe(false);
  });
});

describe('getLegTransferRisk', () => {
  it('catches a missed transfer between two transit legs', () => {
    const legs = [
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      transitLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
    ];
    expect(getLegTransferRisk(legs, 1)).toBe('uncertain');
  });

  it('stays uncertain on a badly missed transfer', () => {
    const legs = [
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      transitLeg({expectedStartTime: '2024-01-01T10:05:00.000Z'}),
    ];
    expect(getLegTransferRisk(legs, 1)).toBe('uncertain');
  });

  it('passes when there is time to spare', () => {
    const legs = [
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      transitLeg({expectedStartTime: '2024-01-01T10:15:00.000Z'}),
    ];
    expect(getLegTransferRisk(legs, 1)).toBeUndefined();
  });

  it('passes on the first leg, which nothing precedes', () => {
    expect(getLegTransferRisk([transitLeg(), transitLeg()], 0)).toBeUndefined();
  });

  it('passes on an index outside the trip', () => {
    expect(getLegTransferRisk([transitLeg()], 5)).toBeUndefined();
  });

  it('passes on a non-transit leg, so a walk carries no warning', () => {
    const legs = [
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      footLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
    ];
    expect(getLegTransferRisk(legs, 1)).toBeUndefined();
  });

  it('passes when there is no transit leg to have arrived from', () => {
    const legs = [
      footLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      transitLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
    ];
    expect(getLegTransferRisk(legs, 1)).toBeUndefined();
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
    expect(getLegTransferRisk(legs, 2)).toBe('uncertain');
  });

  it('passes when the gap is unparseable rather than inventing a risk', () => {
    const legs = [
      transitLeg({expectedEndTime: 'not-a-date'}),
      transitLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
    ];
    expect(getLegTransferRisk(legs, 1)).toBeUndefined();
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
      expect(getLegTransferRisk(legs, 1)).toBeUndefined();
    });

    it('warns when the interchange is explicitly not guaranteed', () => {
      const legs = [
        transitLeg({
          expectedEndTime: '2024-01-01T10:10:00.000Z',
          interchangeTo: {guaranteed: false},
        }),
        transitLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
      ];
      expect(getLegTransferRisk(legs, 1)).toBe('uncertain');
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
      expect(getLegTransferRisk(legs, 2)).toBeUndefined();
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
      expect(getLegTransferRisk(legs, 1)).toBeUndefined();
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
      expect(getLegTransferRisk(legs, 1)).toBeUndefined();
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
      expect(getLegTransferRisk(legs, 1)).toBe('uncertain');
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
      expect(getLegTransferRisk(legs, 2)).toBe('uncertain');
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
      expect(getLegTransferRisk(legs, 1)).toBeUndefined();
    });
  });
});

describe('withTransferRisk', () => {
  it('stamps the leg you might miss, not the one before', () => {
    const legs = withTransferRisk([
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      transitLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
    ]);
    expect(legs[0].transferRisk).toBeUndefined();
    expect(legs[1].transferRisk).toBe('uncertain');
  });

  it('leaves a comfortable transfer unstamped', () => {
    const legs = withTransferRisk([
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      transitLeg({expectedStartTime: '2024-01-01T10:15:00.000Z'}),
    ]);
    expect(legs.every((leg) => leg.transferRisk === undefined)).toBe(true);
  });

  it('clears a risk the caller passed back in, once the gap is fine', () => {
    const legs = withTransferRisk([
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      transitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        transferRisk: TransferRisk.Uncertain,
      }),
    ]);
    expect(legs[1].transferRisk).toBeUndefined();
  });

  it('does not stamp a guaranteed transfer', () => {
    const legs = withTransferRisk([
      transitLeg({
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        interchangeTo: {guaranteed: true},
      }),
      transitLeg({expectedStartTime: '2024-01-01T10:00:00.000Z'}),
    ]);
    expect(legs[1].transferRisk).toBeUndefined();
  });
});

describe('getTripTransferRisk', () => {
  it('passes when every transfer has time to spare', () => {
    const legs = [
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      transitLeg({expectedStartTime: '2024-01-01T10:15:00.000Z'}),
    ];
    expect(getTripTransferRisk(legs)).toBeUndefined();
  });

  it('reports a risk from anywhere in the trip', () => {
    const legs = [
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      transitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
      }),
      transitLeg({expectedStartTime: '2024-01-01T10:24:00.000Z'}),
    ];
    expect(getTripTransferRisk(legs)).toBe('uncertain');
  });

  it('ignores a guaranteed transfer when looking across the trip', () => {
    const legs = [
      transitLeg({
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        interchangeTo: {guaranteed: true},
      }),
      transitLeg({expectedStartTime: '2024-01-01T10:00:00.000Z'}),
    ];
    expect(getTripTransferRisk(legs)).toBeUndefined();
  });

  it('does not need the legs to be stamped first', () => {
    const legs = [
      transitLeg({expectedEndTime: '2024-01-01T10:10:00.000Z'}),
      transitLeg({expectedStartTime: '2024-01-01T10:09:00.000Z'}),
    ];
    expect(getTripTransferRisk(legs)).toBe(
      getTripTransferRisk(withTransferRisk(legs)),
    );
  });
});
