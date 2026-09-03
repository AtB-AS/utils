import type {InterchangeLeg} from './types';
import {InterchangeRisk} from './types';

/** Below this, the interchange is not one to count on. */
export const UNLIKELY_INTERCHANGE_LIMIT_IN_SECONDS = -120;

/**
 * Classifies the gap between arriving and the next departure. Zero counts as
 * uncertain; a non-finite gap yields undefined.
 */
export const getInterchangeRisk = (
  seconds: number,
): InterchangeRisk | undefined => {
  if (!Number.isFinite(seconds) || seconds > 0) {
    return undefined;
  }
  return seconds < UNLIKELY_INTERCHANGE_LIMIT_IN_SECONDS
    ? InterchangeRisk.Unlikely
    : InterchangeRisk.Uncertain;
};

/** Whether a leg is scheduled transit rather than walking, cycling and such. */
export const isTransitLeg = (leg: InterchangeLeg): boolean =>
  leg.serviceJourney != null;

/**
 * The risk of missing the leg at `index` — the service you are boarding, which
 * is where the warning belongs. Arrival is the end of the leg immediately
 * before, so an intervening walk counts.
 *
 * Undefined when the leg is not transit, when no transit leg precedes it, or
 * when the interchange still holds. The transit check also keeps the warning
 * off the leg leading *into* a walk: those gaps are commonly re-anchored to
 * exactly zero, which would otherwise fire on every transfer.
 */
export const getLegInterchangeRisk = (
  legs: InterchangeLeg[],
  index: number,
): InterchangeRisk | undefined => {
  const boarding = legs[index];
  const arriveAt = legs[index - 1];
  if (!boarding || !arriveAt || !isTransitLeg(boarding)) return undefined;

  const alightedFrom = previousTransitLeg(legs, index);
  if (!alightedFrom) return undefined;
  if (interchangeHolds(alightedFrom, boarding, arriveAt)) return undefined;

  return getInterchangeRisk(
    secondsBetween(arriveAt.expectedEndTime, boarding.expectedStartTime),
  );
};

/**
 * The transit leg you alight from, which carries the interchange. Walks back
 * past non-transit legs: bus -> walk -> bus is measured on the (walk, bus)
 * pair, but the first bus holds `interchangeTo`.
 */
const previousTransitLeg = (
  legs: InterchangeLeg[],
  index: number,
): InterchangeLeg | undefined => {
  for (let i = index - 1; i >= 0; i--) {
    if (isTransitLeg(legs[i])) return legs[i];
  }
  return undefined;
};

/**
 * Whether the interchange still guarantees the connection. A guarantee lasts
 * `maximumWaitTime` seconds past the connecting service's scheduled departure;
 * absent, it waits indefinitely. Unparseable times keep the guarantee, so bad
 * data suppresses a warning rather than inventing one.
 */
const interchangeHolds = (
  alightedFrom: InterchangeLeg,
  boarding: InterchangeLeg,
  arriveAt: InterchangeLeg,
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
