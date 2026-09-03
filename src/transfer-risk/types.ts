/** How risky a transfer is when there is no time to spare. */
export const TransferRisk = {
  Uncertain: 'uncertain',
  Unlikely: 'unlikely',
} as const;

export type TransferRisk = (typeof TransferRisk)[keyof typeof TransferRisk];

/**
 * The fields the transfer rules read. Each product's own leg type satisfies
 * this structurally, so no mapping is needed at the call site.
 */
export type TransferLeg = {
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
   * Entur's interchange to the next service. Transit legs only, and often not
   * populated when a leg is fetched by id — preserve it across a refresh.
   */
  interchangeTo?: {
    guaranteed?: boolean | null;
    /** Seconds past its own scheduled departure the connecting service waits. */
    maximumWaitTime?: number | null;
  } | null;
};
