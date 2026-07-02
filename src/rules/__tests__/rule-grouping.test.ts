import {checkRules} from '../check-rules';
import {Rule, RuleOperator, RuleVariables} from '../types';

const createRule = (
  variable: string,
  operator: RuleOperator,
  value: Rule['value'],
  groupId?: string,
): Rule => ({variable, operator, value, groupId});

describe('checkRules without groups', () => {
  it('returns true when there are no rules', () => {
    const localVariables: RuleVariables = {};
    expect(checkRules([], localVariables)).toEqual(true);
  });

  it('returns true when all ungrouped rules pass', () => {
    const localVariables: RuleVariables = {name: 'foo', age: 10};
    const rules = [
      createRule('name', RuleOperator.equalTo, 'foo'),
      createRule('age', RuleOperator.greaterThan, 5),
    ];
    expect(checkRules(rules, localVariables)).toEqual(true);
  });

  it('returns false when one ungrouped rule fails', () => {
    const localVariables: RuleVariables = {name: 'foo', age: 10};
    const rules = [
      createRule('name', RuleOperator.equalTo, 'foo'),
      createRule('age', RuleOperator.lessThan, 5),
    ];
    expect(checkRules(rules, localVariables)).toEqual(false);
  });

  it('returns false when all ungrouped rules fail', () => {
    const localVariables: RuleVariables = {name: 'foo'};
    const rules = [createRule('name', RuleOperator.equalTo, 'not-foo')];
    expect(checkRules(rules, localVariables)).toEqual(false);
  });
});

describe('checkRules with a single group', () => {
  it('returns true when one rule in the group passes', () => {
    const localVariables: RuleVariables = {name: 'foo'};
    const rules = [
      createRule('name', RuleOperator.equalTo, 'foo', 'group1'),
      createRule('name', RuleOperator.equalTo, 'bar', 'group1'),
    ];
    expect(checkRules(rules, localVariables)).toEqual(true);
  });

  it('returns false when no rule in the group passes', () => {
    const localVariables: RuleVariables = {name: 'foo'};
    const rules = [
      createRule('name', RuleOperator.equalTo, 'bar', 'group1'),
      createRule('name', RuleOperator.equalTo, 'baz', 'group1'),
    ];
    expect(checkRules(rules, localVariables)).toEqual(false);
  });
});

describe('checkRules with multiple groups', () => {
  it('returns true when each group has at least one passing rule', () => {
    const localVariables: RuleVariables = {name: 'foo', age: 10};
    const rules = [
      createRule('name', RuleOperator.equalTo, 'foo', 'group1'),
      createRule('name', RuleOperator.equalTo, 'bar', 'group1'),
      createRule('age', RuleOperator.lessThan, 5, 'group2'),
      createRule('age', RuleOperator.greaterThan, 5, 'group2'),
    ];
    expect(checkRules(rules, localVariables)).toEqual(true);
  });

  it('returns false when one group has no passing rule', () => {
    const localVariables: RuleVariables = {name: 'foo', age: 10};
    const rules = [
      createRule('name', RuleOperator.equalTo, 'foo', 'group1'),
      createRule('age', RuleOperator.lessThan, 5, 'group2'),
      createRule('age', RuleOperator.equalTo, 999, 'group2'),
    ];
    expect(checkRules(rules, localVariables)).toEqual(false);
  });
});
