import {z} from 'zod';
import {nullishToOptional} from '../utils';

export enum TravelRightStatus {
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
  Unspecified = '0',
  Both = '1',
  Forwards = '2',
  Backwards = '3',
}

/**
 * For definition, see `UsedAccess` struct in ticket service
 * https://github.com/AtB-AS/ticket/blob/main/firestore-client/src/travel_right.rs
 */
export const UsedAccessType = z.object({
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
});
export type UsedAccessType = z.infer<typeof UsedAccessType>;

export const DatedServiceJourneyRefsType = z.object({
  datedServiceJourneyRef: z.string(),
  startPointRef: z.string(),
  endPointRef: z.string(),
});
export type DatedServiceJourneyRefsType = z.infer<
  typeof DatedServiceJourneyRefsType
>;

/**
 * For definitions, see `TravelRight` struct in ticket service
 * https://github.com/AtB-AS/ticket/blob/main/firestore-client/src/travel_right.rs
 */
export const TravelRightType = z.object({
  id: z.string(),
  customerAccountId: z.string().optional(),
  status: z.nativeEnum(TravelRightStatus),
  fareProductRef: z.string(),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  usageValidityPeriodRef: z.string().optional(),
  userProfileRef: z.string().optional(),
  authorityRef: z.string(),
  tariffZoneRefs: z.array(z.string()).optional(),
  fareZoneRefs: z.array(z.string()).optional(),
  startPointRef: z.string().nullish().transform(nullishToOptional),
  endPointRef: z.string().nullish().transform(nullishToOptional),
  direction: z
    .nativeEnum(TravelRightDirection)
    .nullish()
    .transform(nullishToOptional),
  maximumNumberOfAccesses: z.number().optional(),
  numberOfUsedAccesses: z.number().optional(),
  usedAccesses: z.array(UsedAccessType).optional(),
  schoolName: z.string().optional(),
  travelerName: z.string().optional(),
  datedServiceJourneys: z
    .array(DatedServiceJourneyRefsType)
    .nullish()
    .transform(nullishToOptional),
});
export type TravelRightType = z.infer<typeof TravelRightType>;

export enum FareContractState {
  Unspecified = 0,
  NotActivated = 1,
  Activated = 2,
  Cancelled = 3,
  Refunded = 4,
  Moved = 5,
  Expired = 6,
  Archived = 7,
}

enum FormFactor {
  Bicycle = 'BICYCLE',
  Car = 'CAR',
  CargoBicycle = 'CARGO_BICYCLE',
  Moped = 'MOPED',
  Other = 'OTHER',
  Scooter = 'SCOOTER',
  ScooterSeated = 'SCOOTER_SEATED',
  ScooterStanding = 'SCOOTER_STANDING',
}

const FormFactorSchema = z.enum(
  Object.values(FormFactor) as [FormFactor, ...FormFactor[]],
);

/**
 * For definition, see `FareContract` struct in ticket service
 * https://github.com/AtB-AS/ticket/blob/main/firestore-client/src/fare_contract.rs
 */
export const FareContractType = z.object({
  created: z.coerce.date(),
  id: z.string(),
  customerAccountId: z.string(),
  orderId: z.string(),
  bookingId: z.string().uuid().optional(),
  formFactor: FormFactorSchema.optional(),
  operatorId: z.string().optional(),
  paymentType: z.array(z.string()),
  qrCode: z.string().optional(),
  state: z.nativeEnum(FareContractState),
  totalAmount: z.string(),
  totalTaxAmount: z.string(),
  travelRights: z.array(TravelRightType).nonempty(),
  version: z.string(),
  purchasedBy: z.string().optional(),
});
export type FareContractType = z.infer<typeof FareContractType>;
