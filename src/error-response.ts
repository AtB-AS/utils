import {z} from 'zod';

/** https://github.com/AtB-AS/amp-rs/blob/main/amp-http/src/lib.rs */
export const HttpError = z.object({
  code: z.number(),
  message: z.string(),
});
export type HttpError = z.infer<typeof HttpError>;

/** https://github.com/AtB-AS/amp-rs/blob/main/amp-http/src/lib.rs */
export const ErrorResponse = z.object({
  http: HttpError,
  kind: z.string(),
  message: z.string().nullish(),
  details: z.array(z.unknown()).nullish(),
});
export type ErrorResponse = z.infer<typeof ErrorResponse>;
