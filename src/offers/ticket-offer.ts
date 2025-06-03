import {z} from 'zod';

/**
 * FlexDiscountStep in
 * https://github.com/AtB-AS/sales/blob/main/sales-service/src/flexible.rs
 */
export const FlexDiscountStep = z.object({
  expires: z.string().nullish(),
  discount: z.number(),
});

/**
 * FlexDiscountLadder in
 * https://github.com/AtB-AS/sales/blob/main/sales-service/src/flexible.rs
 */
export const FlexDiscountLadder = z.object({
  current: z.number(),
  steps: z.array(FlexDiscountStep),
});

/**
 * SearchOfferPrice in
 * https://github.com/AtB-AS/sales/blob/main/sales-service/src/handlers/sales/search.rs
 */
export const SearchOfferPrice = z.object({
  originalAmount: z.string(),
  originalAmountFloat: z.number().nullish(),
  amount: z.string(),
  amountFloat: z.number().nullish(),
  currency: z.string(),
  vatGroup: z.string().nullish(),
});
export type SearchOfferPrice = z.infer<typeof SearchOfferPrice>;

/**
 * OfferValidity in
 * https://github.com/AtB-AS/sales/blob/main/sales-service/src/handlers/sales/search.rs
 */
export enum OfferValidity {
  Zonal = 1,
  PointToPoint = 2,
  NonGeographical = 3,
}

/**
 * TicketRoute in
 * https://github.com/AtB-AS/sales/blob/main/sales-service/src/handlers/sales/search.rs
 */
export const TicketRoute = z.object({
  type: z.nativeEnum(OfferValidity),
  from: z.string().nullish(),
  to: z.string().nullish(),
});

/**
 * TicketOffer in
 * https://github.com/AtB-AS/sales/blob/main/sales-service/src/handlers/sales/search.rs
 */
export const TicketOffer = z.object({
  offerId: z.string(),
  travellerId: z.string(),
  price: SearchOfferPrice,
  fareProduct: z.string(),
  validFrom: z.string().nullish(),
  validTo: z.string().nullish(),
  flexDiscountLadder: FlexDiscountLadder.nullish(),
  route: z.any(),
  shouldStartNow: z.boolean(),
  available: z.number().nullish(),
});
export type TicketOffer = z.infer<typeof TicketOffer>;

export const TicketOffers = z.array(TicketOffer);
export type TicketOffers = z.infer<typeof TicketOffers>;
