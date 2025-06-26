import {z} from 'zod';
import {nullishToOptional} from '../utils';

/**
 * FlexDiscountStep in
 * https://github.com/AtB-AS/sales/blob/main/sales-service/src/flexible.rs
 */
export const FlexDiscountStep = z.object({
  expires: z.string().nullish().transform(nullishToOptional),
  discount: z.number(),
});
export type FlexDiscountStep = z.infer<typeof FlexDiscountStep>;

/**
 * FlexDiscountLadder in
 * https://github.com/AtB-AS/sales/blob/main/sales-service/src/flexible.rs
 */
export const FlexDiscountLadder = z.object({
  current: z.number(),
  steps: z.array(FlexDiscountStep),
});
export type FlexDiscountLadder = z.infer<typeof FlexDiscountLadder>;

/**
 * SearchOfferPrice in
 * https://github.com/AtB-AS/sales/blob/main/sales-service/src/handlers/sales/search.rs
 */
export const SearchOfferPrice = z.object({
  originalAmount: z.string(),
  originalAmountFloat: z.number().nullish().transform(nullishToOptional),
  amount: z.string(),
  amountFloat: z.number().nullish().transform(nullishToOptional),
  currency: z.string(),
  vatGroup: z.string().nullish().transform(nullishToOptional),
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
  from: z.string().nullish().transform(nullishToOptional),
  to: z.string().nullish().transform(nullishToOptional),
});
export type TicketRoute = z.infer<typeof TicketRoute>;

/**
 * TicketOffer in
 * https://github.com/AtB-AS/sales/blob/main/sales-service/src/handlers/sales/search.rs
 */
export const TicketOffer = z.object({
  offerId: z.string(),
  travellerId: z.string(),
  price: SearchOfferPrice,
  fareProduct: z.string(),
  validFrom: z.string().nullish().transform(nullishToOptional),
  validTo: z.string().nullish().transform(nullishToOptional),
  flexDiscountLadder: FlexDiscountLadder.nullish().transform(nullishToOptional),
  route: TicketRoute,
  shouldStartNow: z.boolean(),
  available: z.number().nullish().transform(nullishToOptional),
});
export type TicketOffer = z.infer<typeof TicketOffer>;

export const TicketOffers = z.array(TicketOffer);
export type TicketOffers = z.infer<typeof TicketOffers>;
