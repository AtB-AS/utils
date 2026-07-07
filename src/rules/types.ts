import {z} from 'zod';

const RuleValue = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type RuleValue = z.infer<typeof RuleValue>;

export type RuleVariables = {
  [key: string]: RuleValue | RuleValue[];
};

export enum RuleOperator {
  equalTo = 'equalTo',
  notEqualTo = 'notEqualTo',
  greaterThan = 'greaterThan',
  lessThan = 'lessThan',
  greaterThanOrEqualTo = 'greaterThanOrEqualTo',
  lessThanOrEqualTo = 'lessThanOrEqualTo',
  contains = 'contains',
  notContains = 'notContains',
  onlyContains = 'onlyContains',
}

export const Rule = z.object({
  variable: z.string().describe('key of RuleVariables'), // if passing down ruleVariables to the zod parsing, this can be enforced runtime with refine
  operator: z.nativeEnum(RuleOperator),
  value: RuleValue,
  groupId: z.string().optional(),
});
export type Rule = z.infer<typeof Rule>;
