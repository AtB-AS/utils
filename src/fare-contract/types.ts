import { z } from "zod";

enum TravelRightStatus {
  UNSPECIFIED = 0,
  RESERVED = 1,
  ORDERED = 2,
  PAID_FOR = 3,
  UNUSED = 4,
  ACTIVATED = 5,
  PARTIALLY_USED = 6,
  USED = 7,
  ARCHIVED = 8,
  OTHER = 9,
  CANCELLED = 20,
  REFUNDED = 21,
}

export enum TravelRightDirection {
  Unspecified = "0",
  Both = "1",
  Forwards = "2",
  Backwards = "3",
}

/**
 * For definition, see `UsedAccess` struct in ticket service
 * https://github.com/AtB-AS/ticket/blob/main/firestore-client/src/travel_right.rs
 */
export const UsedAccess = z.object({
  startDateTime: z.date(),
  endDateTime: z.date(),
});
export type UsedAccess = z.infer<typeof UsedAccess>;

/**
 * For definitions, see `TravelRight` struct in ticket service
 * https://github.com/AtB-AS/ticket/blob/main/firestore-client/src/travel_right.rs
 */
export const TravelRight = z.object({
  id: z.string(),
  customerAccountId: z.string().optional(),
  status: z.nativeEnum(TravelRightStatus),
  fareProductRef: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  usageValidityPeriodRef: z.string(),
  userProfileRef: z.string(),
  authorityRef: z.string(),
  tariffZoneRefs: z.array(z.string()).optional(),
  fareZoneRefs: z.array(z.string()).optional(),
  startPointRef: z.string().optional(),
  endPointRef: z.string().optional(),
  direction: z.nativeEnum(TravelRightDirection).optional(),
  maximumNumberOfAccesses: z.number().optional(),
  numberOfUsedAccesses: z.number().optional(),
  usedAccesses: z.array(UsedAccess).optional(),
});
export type TravelRight = z.infer<typeof TravelRight>;

export enum FareContractState {
  Unspecified = 0,
  NotActivated = 1,
  Activated = 2,
  Cancelled = 3,
  Refunded = 4,
}
/**
 * For definition, see `FareContract` struct in ticket service
 * https://github.com/AtB-AS/ticket/blob/main/firestore-client/src/fare_contract.rs
 */
export const FareContract = z.object({
  created: z.date(),
  id: z.string(),
  customerAccountId: z.string(),
  orderId: z.string(),
  paymentType: z.array(z.string()),
  qrCode: z.string().optional(),
  state: z.nativeEnum(FareContractState),
  totalAmount: z.string(),
  totalTaxAmount: z.string(),
  travelRights: z.array(TravelRight).nonempty(),
  version: z.string(),
  purchasedBy: z.string(),
});
export type FareContract = z.infer<typeof FareContract>;
