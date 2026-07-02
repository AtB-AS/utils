import {checkRule} from '../check';
import {Rule, RuleOperator, RuleVariables} from '../types';

const createRule = (
  variable: string,
  operator: RuleOperator,
  value: Rule['value'],
): Rule => ({variable, operator, value});

describe('RuleOperator.equalTo', () => {
  it('returns true when string values are equal', () => {
    const localVariables: RuleVariables = {name: 'foo'};
    const rule = createRule('name', RuleOperator.equalTo, 'foo');
    expect(checkRule(rule, localVariables)).toEqual(true);
  });

  it('returns true when number values are equal', () => {
    const localVariables: RuleVariables = {age: 5};
    const rule = createRule('age', RuleOperator.equalTo, 5);
    expect(checkRule(rule, localVariables)).toEqual(true);
  });

  it('returns false when values are not equal', () => {
    const localVariables: RuleVariables = {name: 'foo'};
    const rule = createRule('name', RuleOperator.equalTo, 'not-foo');
    expect(checkRule(rule, localVariables)).toEqual(false);
  });

  it('returns false when number values are not equal', () => {
    const localVariables: RuleVariables = {age: 5};
    const rule = createRule('age', RuleOperator.equalTo, 10);
    expect(checkRule(rule, localVariables)).toEqual(false);
  });
});

describe('RuleOperator.notEqualTo', () => {
  it('returns true when values are not equal', () => {
    const localVariables: RuleVariables = {name: 'foo'};
    const rule = createRule('name', RuleOperator.notEqualTo, 'not-foo');
    expect(checkRule(rule, localVariables)).toEqual(true);
  });

  it('returns false when values are equal', () => {
    const localVariables: RuleVariables = {age: 5};
    const rule = createRule('age', RuleOperator.notEqualTo, 5);
    expect(checkRule(rule, localVariables)).toEqual(false);
  });
});

describe('RuleOperator.greaterThan', () => {
  it('returns true when local number is greater than rule number', () => {
    const localVariables: RuleVariables = {age: 10};
    const rule = createRule('age', RuleOperator.greaterThan, 5);
    expect(checkRule(rule, localVariables)).toEqual(true);
  });
});

describe('RuleOperator.lessThan', () => {
  it('returns true when local number is less than rule number', () => {
    const localVariables: RuleVariables = {age: 5};
    const rule = createRule('age', RuleOperator.lessThan, 10);
    expect(checkRule(rule, localVariables)).toEqual(true);
  });
});

describe('RuleOperator.greaterThanOrEqualTo', () => {
  it('returns true when local number is greater than rule number', () => {
    const localVariables: RuleVariables = {age: 10};
    const rule = createRule('age', RuleOperator.greaterThanOrEqualTo, 5);
    expect(checkRule(rule, localVariables)).toEqual(true);
  });

  it('returns true when local number equals rule number', () => {
    const localVariables: RuleVariables = {age: 5};
    const rule = createRule('age', RuleOperator.greaterThanOrEqualTo, 5);
    expect(checkRule(rule, localVariables)).toEqual(true);
  });

  it('returns false when local number is less than rule number', () => {
    const localVariables: RuleVariables = {age: 3};
    const rule = createRule('age', RuleOperator.greaterThanOrEqualTo, 5);
    expect(checkRule(rule, localVariables)).toEqual(false);
  });

  it('returns false when values are not comparable types', () => {
    const localVariables: RuleVariables = {isActive: true};
    const rule = createRule(
      'isActive',
      RuleOperator.greaterThanOrEqualTo,
      true,
    );
    expect(checkRule(rule, localVariables)).toEqual(false);
  });
});

describe('RuleOperator.lessThanOrEqualTo', () => {
  it('returns true when local number is less than rule number', () => {
    const localVariables: RuleVariables = {age: 3};
    const rule = createRule('age', RuleOperator.lessThanOrEqualTo, 5);
    expect(checkRule(rule, localVariables)).toEqual(true);
  });

  it('returns true when local number equals rule number', () => {
    const localVariables: RuleVariables = {age: 5};
    const rule = createRule('age', RuleOperator.lessThanOrEqualTo, 5);
    expect(checkRule(rule, localVariables)).toEqual(true);
  });

  it('returns false when local number is greater than rule number', () => {
    const localVariables: RuleVariables = {age: 10};
    const rule = createRule('age', RuleOperator.lessThanOrEqualTo, 5);
    expect(checkRule(rule, localVariables)).toEqual(false);
  });

  it('returns false when values are not comparable types', () => {
    const localVariables: RuleVariables = {isActive: true};
    const rule = createRule('isActive', RuleOperator.lessThanOrEqualTo, true);
    expect(checkRule(rule, localVariables)).toEqual(false);
  });
});

describe('RuleOperator.contains', () => {
  it('returns true when local array contains the rule value', () => {
    const localVariables: RuleVariables = {tags: ['a', 'b', 'c']};
    const rule = createRule('tags', RuleOperator.contains, 'b');
    expect(checkRule(rule, localVariables)).toEqual(true);
  });

  it('returns false when local array does not contain the rule value', () => {
    const localVariables: RuleVariables = {tags: ['a', 'b', 'c']};
    const rule = createRule('tags', RuleOperator.contains, 'd');
    expect(checkRule(rule, localVariables)).toEqual(false);
  });

  it('returns false when local value is not an array', () => {
    const localVariables: RuleVariables = {tags: 'a'};
    const rule = createRule('tags', RuleOperator.contains, 'a');
    expect(checkRule(rule, localVariables)).toEqual(false);
  });
});

describe('RuleOperator.notContains', () => {
  it('returns true when local array does not contain the rule value', () => {
    const localVariables: RuleVariables = {tags: ['a', 'b', 'c']};
    const rule = createRule('tags', RuleOperator.notContains, 'd');
    expect(checkRule(rule, localVariables)).toEqual(true);
  });

  it('returns false when local array contains the rule value', () => {
    const localVariables: RuleVariables = {tags: ['a', 'b', 'c']};
    const rule = createRule('tags', RuleOperator.notContains, 'b');
    expect(checkRule(rule, localVariables)).toEqual(false);
  });

  it('returns false when local value is not an array', () => {
    const localVariables: RuleVariables = {tags: 'a'};
    const rule = createRule('tags', RuleOperator.notContains, 'd');
    expect(checkRule(rule, localVariables)).toEqual(false);
  });
});

describe('RuleOperator.onlyContains', () => {
  it('returns true when every element in the local array equals the rule value', () => {
    const localVariables: RuleVariables = {tags: ['a', 'a', 'a']};
    const rule = createRule('tags', RuleOperator.onlyContains, 'a');
    expect(checkRule(rule, localVariables)).toEqual(true);
  });

  it('returns true when the local array is empty', () => {
    const localVariables: RuleVariables = {tags: []};
    const rule = createRule('tags', RuleOperator.onlyContains, 'a');
    expect(checkRule(rule, localVariables)).toEqual(true);
  });

  it('returns false when some element in the local array does not equal the rule value', () => {
    const localVariables: RuleVariables = {tags: ['a', 'b', 'a']};
    const rule = createRule('tags', RuleOperator.onlyContains, 'a');
    expect(checkRule(rule, localVariables)).toEqual(false);
  });

  it('returns false when local value is not an array', () => {
    const localVariables: RuleVariables = {tags: 'a'};
    const rule = createRule('tags', RuleOperator.onlyContains, 'a');
    expect(checkRule(rule, localVariables)).toEqual(false);
  });
});

describe('checkRule variable resolution', () => {
  it('returns false when the variable is not present in localVariables', () => {
    const localVariables: RuleVariables = {name: 'foo'};
    const rule = createRule('missing', RuleOperator.equalTo, 'foo');
    expect(checkRule(rule, localVariables)).toEqual(false);
  });
});
