/** How risky an interchange is when there is no time to spare. */
export const InterchangeRisk = {
  Uncertain: 'uncertain',
  Unlikely: 'unlikely',
} as const;

export type InterchangeRisk =
  (typeof InterchangeRisk)[keyof typeof InterchangeRisk];

/**
 * The fields the interchange rules read. Each product's own leg type satisfies
 * this structurally, so no mapping is needed at the call site.
 */
export type InterchangeLeg = {
  /** Scheduled departure. The reference point for `maximumWaitTime`. */
  aimedStartTime: string;
  expectedStartTime: string;
  expectedEndTime: string;
  /**
   * Present on scheduled transit legs only. More reliable than mode or quay:
   * a transfer walk between two stops has quays too.
   */
  serviceJourney?: {id: string} | null;
  /**
   * Interchange to the next service. Transit legs only, and often not
   * populated when a leg is fetched by id — preserve it across a refresh.
   */
  interchangeTo?: {
    guaranteed?: boolean | null;
    /** Seconds past its own scheduled departure the connecting service waits. */
    maximumWaitTime?: number | null;
  } | null;
};
