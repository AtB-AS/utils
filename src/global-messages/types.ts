import {z} from 'zod';
import {LanguageAndTextSchema} from '../common/language-and-text';
import {Rule} from '../rules/types';
import {AppPlatform} from '../common/app-platform';

/**
 * Create a global message schema with a consumer specific context enum.
 *
 * @example
 * export enum GlobalMessageContextEnum {
 *   webOverview = 'web-overview',
 * }
 * const GlobalMessageContextSchema = z.enum(GlobalMessageContextEnum);
 * export const GlobalMessageSchema = createGlobalMessageSchema(
 *   GlobalMessageContextSchema,
 * );
 */
export function createGlobalMessageSchema<ContextEnum extends z.ZodType>(
  contextEnum: ContextEnum,
) {
  return z.object({
    id: z.string(),
    active: z.boolean(),
    title: z.array(LanguageAndTextSchema).optional(),
    body: z.array(LanguageAndTextSchema),
    link: z.array(LanguageAndTextSchema).optional(),
    linkText: z.array(LanguageAndTextSchema).optional(),
    type: z.enum(['error', 'valid', 'info', 'warning']),
    subtle: z.boolean().optional(),
    context: z.array(contextEnum),
    isDismissable: z.boolean().optional(),
    appPlatforms: z.array(AppPlatform).optional(),
    appVersionMin: z.string().optional(),
    appVersionMax: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    rules: z.array(Rule).optional(),
  });
}

export type GenericGlobalMessageType<ContextEnum extends z.ZodType> = z.infer<
  ReturnType<typeof createGlobalMessageSchema<ContextEnum>>
>;
