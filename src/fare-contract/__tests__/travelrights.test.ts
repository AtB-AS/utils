import {carnetTravelRight} from './fixtures/carnet-travelright';
import {nightTravelRight} from './fixtures/night-travelright';
import {periodTravelRight} from './fixtures/period-travelright';
import {periodBoatTravelRight} from './fixtures/period-boat-travelright';
import {singleTravelRight} from './fixtures/single-travelright';
import {singleBoatTravelRight} from './fixtures/single-boat-travelright';
import {youthTravelRight} from './fixtures/youth-travelright';

import {TravelRightType} from '../types';
import {getAccesses} from '../accesses';
import {skoleskyssTravelRight} from './fixtures/skoleskyss-travelright';
import {periodBoatFareContract} from './fixtures/period-boat-farecontract';
import {carnetFareContract} from './fixtures/carnet-farecontact';

describe('Travelright type', () => {
  it('all should resolve to normal', async () => {
    expect(TravelRightType.safeParse(nightTravelRight).success).toBe(true);
    expect(TravelRightType.safeParse(periodTravelRight).success).toBe(true);
    expect(
      TravelRightType.safeParse(periodBoatTravelRight as TravelRightType)
        .success,
    ).toBe(true);
    expect(TravelRightType.safeParse(singleTravelRight).success).toBe(true);
    expect(
      TravelRightType.safeParse(singleBoatTravelRight as TravelRightType)
        .success,
    ).toBe(true);
    expect(TravelRightType.safeParse(youthTravelRight).success).toBe(true);
    expect(TravelRightType.safeParse(carnetTravelRight).success).toBe(true);
  });

  it('non carnets should not have flattened accesses', async () => {
    expect(getAccesses(periodBoatFareContract)).toBe(undefined);
  });

  it('carnets should have flattened accesses', async () => {
    expect(getAccesses(carnetFareContract)).toBeDefined();
  });

  it('skoleskyss should not resolve to normal', async () => {
    expect(
      TravelRightType.safeParse(skoleskyssTravelRight as any).success,
    ).toBe(false);
  });
});
