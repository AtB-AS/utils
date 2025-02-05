import {UsedAccess, TravelRight} from './types';
import {flatten, sumBy} from 'lodash';

type FlattenedAccesses = {
  usedAccesses: UsedAccess[];
  maximumNumberOfAccesses: number;
  numberOfUsedAccesses: number;
};
export function flattenTravelRightAccesses(
  travelRights: TravelRight[],
): FlattenedAccesses | undefined {
  // If there are no accesses, return undefined
  if (!hasTravelRightAccesses(travelRights)) return undefined;

  const allUsedAccesses = travelRights.map((t) => t.usedAccesses ?? []);
  const usedAccesses = flatten(allUsedAccesses).sort(
    (a, b) => a.startDateTime.getTime() - b.startDateTime.getTime(),
  );
  const maximumNumberOfAccesses = sumBy(
    travelRights,
    (t) => t.maximumNumberOfAccesses ?? 0,
  );
  const numberOfUsedAccesses = sumBy(
    travelRights,
    (t) => t.numberOfUsedAccesses ?? 0,
  );
  return {
    usedAccesses,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  };
}

export function hasTravelRightAccesses(travelRights: TravelRight[]) {
  return travelRights.some((tr) => tr.maximumNumberOfAccesses !== undefined);
}
