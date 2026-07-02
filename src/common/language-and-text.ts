import {z} from 'zod';

export const LanguageAndTextSchema = z.union([
  z.object({
    lang: z.string(),
    value: z.string(),
  }),
  z.object({
    language: z.string().optional(),
    value: z.string().optional(),
  }),
]);

export type LanguageAndTextType = z.infer<typeof LanguageAndTextSchema>;
