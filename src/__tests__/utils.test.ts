import {nullishToOptional, formatNumberToString, Language} from '../utils';

describe('nullishToOptional', () => {
  it('should return undefined for nullish values', () => {
    expect(nullishToOptional(null)).toBeUndefined();
    expect(nullishToOptional(undefined)).toBeUndefined();
  });

  it('should return the original value for non-nullish values', () => {
    expect(nullishToOptional(0)).toBe(0);
    expect(nullishToOptional('')).toBe('');
    expect(nullishToOptional(false)).toBe(false);
    expect(nullishToOptional('test')).toBe('test');
  });
});

describe('formatNumberToString', () => {
  it('should format integer without decimals by default', () => {
    expect(formatNumberToString(10, Language.Norwegian)).toBe('10');
  });

  it('should format number with one decimal to two decimals by default', () => {
    expect(formatNumberToString(10.1, Language.Norwegian)).toBe('10,10');
  });

  it('should round and format number with more than two decimals', () => {
    expect(formatNumberToString(10.125, Language.Norwegian)).toBe('10,13');
    expect(formatNumberToString(10.999, Language.Norwegian)).toBe('11');
  });

  it('should use minDigits and maxDigits when provided', () => {
    expect(formatNumberToString(10.1, Language.Norwegian, 1, 1)).toBe('10,1');
    expect(formatNumberToString(10.1, Language.Norwegian, 3, 3)).toBe('10,100');
    expect(formatNumberToString(10, Language.Norwegian, 1, 1)).toBe('10,0');
    expect(formatNumberToString(10, Language.Norwegian, 0, 3)).toBe('10');
  });

  it('should prioritize maxDigits if it is less than minDigits', () => {
    expect(formatNumberToString(10.1234, Language.Norwegian, 3, 1)).toBe(
      '10,1',
    );
  });

  it('should use correct locale for formatting', () => {
    expect(formatNumberToString(1234.5, Language.English)).toBe('1,234.50');
    // Norwegian locale uses non-breaking space as thousand separator
    expect(formatNumberToString(1234.5, Language.Norwegian)).toBe(
      '1\u00a0234,50',
    );
  });
});
