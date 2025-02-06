import {carnetTravelRight} from './fixtures/carnet-travelright';
import {nightTravelRight} from './fixtures/night-travelright';
import {periodTravelRight} from './fixtures/period-travelright';
import {periodBoatTravelRight} from './fixtures/period-boat-travelright';
import {singleTravelRight} from './fixtures/single-travelright';
import {singleBoatTravelRight} from './fixtures/single-boat-travelright';
import {youthTravelRight} from './fixtures/youth-travelright';

import {TravelRight} from '../types';
import {getAccesses} from '../accesses';
import {skoleskyssTravelRight} from './fixtures/skoleskyss-travelright';

describe('Travelright type', () => {
  it('all should resolve to normal', async () => {
    expect(TravelRight.safeParse(nightTravelRight).success).toBe(true);
    expect(TravelRight.safeParse(periodTravelRight).success).toBe(true);
    expect(
      TravelRight.safeParse(periodBoatTravelRight as TravelRight).success,
    ).toBe(true);
    expect(TravelRight.safeParse(singleTravelRight).success).toBe(true);
    expect(
      TravelRight.safeParse(singleBoatTravelRight as TravelRight).success,
    ).toBe(true);
    expect(TravelRight.safeParse(youthTravelRight).success).toBe(true);
    expect(TravelRight.safeParse(carnetTravelRight).success).toBe(true);
  });

  it('non carnets should not have flattened accesses', async () => {
    expect(getAccesses([nightTravelRight])).toBe(undefined);
    expect(getAccesses([periodTravelRight])).toBe(undefined);
    expect(getAccesses([periodBoatTravelRight as TravelRight])).toBe(undefined);
    expect(getAccesses([singleTravelRight])).toBe(undefined);
    expect(getAccesses([singleBoatTravelRight as TravelRight])).toBe(undefined);
    expect(getAccesses([youthTravelRight])).toBe(undefined);
  });

  it('carnets should have flattened accesses', async () => {
    expect(getAccesses([carnetTravelRight])).toBeDefined();
  });

  it('skoleskyss should not resolve to normal', async () => {
    expect(TravelRight.safeParse(skoleskyssTravelRight as any).success).toBe(
      false,
    );
  });
});
