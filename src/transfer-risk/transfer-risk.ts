import type {TransferLeg} from './types';
import {TransferRisk} from './types';

/**
 * Classifies the gap between arriving and the next departure: a negative gap is
 * uncertain, however small. A zero-second transfer is treated as feasible by Entur and may be
 * returned by the trip planner, so it is not treated as a risky transfer. Non-finite values yield undefined.
 */
export const getTransferRisk = (seconds: number): TransferRisk | undefined => {
  if (!Number.isFinite(seconds) || seconds >= 0) {
    return undefined;
  }
  return TransferRisk.Uncertain;
};

/** Whether a leg is scheduled transit rather than walking, cycling and such. */
export const isTransitLeg = (leg: TransferLeg): boolean =>
  leg.serviceJourney != null;

/**
 * The risk of missing the leg at `index` — the service you are boarding, which
 * is where the warning belongs. Arrival is the end of the leg immediately
 * before, so an intervening walk counts.
 *
 * Undefined when the leg is not transit, when no transit leg precedes it, or
 * when the transfer still holds. The transit check keeps the warning off the leg
 * leading *into* a walk, where it would sit on a leg clients are free to filter
 * out of the display.
 */
export const getLegTransferRisk = (
  legs: TransferLeg[],
  index: number,
): TransferRisk | undefined => {
  const boarding = legs[index];
  const arriveAt = legs[index - 1];
  if (!boarding || !arriveAt || !isTransitLeg(boarding)) return undefined;

  const alightedFrom = previousTransitLeg(legs, index);
  if (!alightedFrom) return undefined;
  if (transferHolds(alightedFrom, boarding, arriveAt)) return undefined;

  return getTransferRisk(
    secondsBetween(arriveAt.expectedEndTime, boarding.expectedStartTime),
  );
};

/**
 * Stamps `transferRisk` on each transit leg the trip is at risk of missing.
 *
 * The risk sits on the boarding leg rather than the leg before the gap:
 * clients filter insignificant foot legs out of the display but never transit
 * legs, so a warning here cannot be filtered away.
 *
 * Always overwrites, including with `undefined`. Clients round-trip the whole
 * trip pattern back to the server, so a leg that fails to refresh arrives
 * carrying the risk from an earlier response; leaving it in place would keep a
 * warning on screen after the delay behind it had cleared.
 */
export const withTransferRisk = <
  T extends TransferLeg & {transferRisk?: TransferRisk},
>(
  legs: T[],
): T[] =>
  legs.map((leg, index) => ({
    ...leg,
    transferRisk: getLegTransferRisk(legs, index),
  }));

/**
 * The worst transfer risk across a trip, for a trip-level field. Computed from
 * the legs rather than read off `transferRisk`, so it does not depend on
 * `withTransferRisk` having run first.
 *
 * There is one level today, so the first risky transfer is the worst — add a
 * severity comparison here if a second level is introduced.
 */
export const getTripTransferRisk = (
  legs: TransferLeg[],
): TransferRisk | undefined => {
  for (let index = 0; index < legs.length; index++) {
    const risk = getLegTransferRisk(legs, index);
    if (risk) return risk;
  }
  return undefined;
};

/**
 * The transit leg you alight from, which carries the interchange. Walks back
 * past non-transit legs: bus -> walk -> bus is measured on the (walk, bus)
 * pair, but the first bus holds `interchangeTo`.
 */
const previousTransitLeg = (
  legs: TransferLeg[],
  index: number,
): TransferLeg | undefined => {
  for (let i = index - 1; i >= 0; i--) {
    if (isTransitLeg(legs[i])) return legs[i];
  }
  return undefined;
};

/**
 * Whether the interchange still guarantees the transfer. A guarantee lasts
 * `maximumWaitTime` seconds past the connecting service's scheduled departure;
 * absent, it waits indefinitely. Unparseable times keep the guarantee, so bad
 * data suppresses a warning rather than inventing one.
 */
const transferHolds = (
  alightedFrom: TransferLeg,
  boarding: TransferLeg,
  arriveAt: TransferLeg,
): boolean => {
  const interchange = alightedFrom.interchangeTo;
  if (interchange?.guaranteed !== true) return false;
  if (interchange.maximumWaitTime == null) return true;

  const deadline =
    toEpochMs(boarding.aimedStartTime) + interchange.maximumWaitTime * 1000;
  const arrival = toEpochMs(arriveAt.expectedEndTime);
  if (!Number.isFinite(deadline) || !Number.isFinite(arrival)) return true;

  return arrival <= deadline;
};

const secondsBetween = (from: string, to: string): number =>
  (toEpochMs(to) - toEpochMs(from)) / 1000;

const toEpochMs = (isoDate: string): number => new Date(isoDate).getTime();
