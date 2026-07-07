import {z} from 'zod';
import {LanguageAndTextSchema} from '../common/language-and-text';
import {Rule} from '../rules/types';
import {AppPlatform} from '../common/app-platform';

export const GlobalMessageSchema = z.object({
  id: z.string(),
  active: z.boolean(),
  title: z.array(LanguageAndTextSchema).optional(),
  body: z.array(LanguageAndTextSchema),
  link: z.array(LanguageAndTextSchema).optional(),
  linkText: z.array(LanguageAndTextSchema).optional(),
  type: z.enum(['error', 'valid', 'info', 'warning']),
  subtle: z.boolean().optional(),
  context: z.array(z.string()).nonempty(),
  isDismissable: z.boolean().optional(),
  appPlatforms: z.array(AppPlatform).optional(),
  appVersionMin: z.string().optional(),
  appVersionMax: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  rules: z.array(Rule).optional(),
});

export type GlobalMessageType = z.infer<typeof GlobalMessageSchema>;
