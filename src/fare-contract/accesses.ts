import {UsedAccessType, FareContractType} from './types';
import {flatten, sumBy} from 'lodash';

type AccessInfoType = {
  usedAccesses: UsedAccessType[];
  maximumNumberOfAccesses: number;
  numberOfUsedAccesses: number;
};
export function getAccesses(
  fareContract: FareContractType,
): AccessInfoType | undefined {
  // If there are no accesses, return undefined
  if (!hasAccesses(fareContract)) return undefined;

  const allUsedAccesses = fareContract.travelRights.map(
    (t) => t.usedAccesses ?? [],
  );
  const usedAccesses = flatten(allUsedAccesses).sort(
    (a, b) => a.startDateTime.getTime() - b.startDateTime.getTime(),
  );
  const maximumNumberOfAccesses = sumBy(
    fareContract.travelRights,
    (t) => t.maximumNumberOfAccesses ?? 0,
  );
  const numberOfUsedAccesses = sumBy(
    fareContract.travelRights,
    (t) => t.numberOfUsedAccesses ?? 0,
  );
  return {
    usedAccesses,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  };
}

export function hasAccesses(fareContract: FareContractType) {
  return fareContract.travelRights.some(
    (tr) => tr.maximumNumberOfAccesses !== undefined,
  );
}
