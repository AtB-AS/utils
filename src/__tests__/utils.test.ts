import {nullishToOptional, formatNumberToString} from '../utils';

export enum AppLanguage {
  Norwegian = 'nb',
  English = 'en',
  Nynorsk = 'nn',
}

export enum PlannerWebLanguage {
  Norwegian = 'no',
  English = 'en-US',
  Nynorsk = 'nn',
}

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

function runFormatNumberToStringTests(
  Enum: typeof AppLanguage | typeof PlannerWebLanguage,
  enumName: string,
) {
  describe(`formatNumberToString with ${enumName}`, () => {
    it('should format integer without decimals by default', () => {
      expect(formatNumberToString(10, Enum.Norwegian)).toBe('10');
    });

    it('should format number with one decimal to two decimals by default', () => {
      expect(formatNumberToString(10.1, Enum.Norwegian)).toBe('10,10');
    });

    it('should round and format number with more than two decimals', () => {
      expect(formatNumberToString(10.125, Enum.Norwegian)).toBe('10,13');
      expect(formatNumberToString(10.999, Enum.Norwegian)).toBe('11');
    });

    it('should use minDigits and maxDigits when provided', () => {
      expect(formatNumberToString(10.1, Enum.Norwegian, 1, 1)).toBe('10,1');
      expect(formatNumberToString(10.1, Enum.Norwegian, 3, 3)).toBe('10,100');
      expect(formatNumberToString(10, Enum.Norwegian, 1, 1)).toBe('10,0');
      expect(formatNumberToString(10, Enum.Norwegian, 0, 3)).toBe('10');
    });

    it('should prioritize maxDigits if it is less than minDigits', () => {
      expect(formatNumberToString(10.1234, Enum.Norwegian, 3, 1)).toBe('10,1');
    });

    it('should use correct locale for formatting', () => {
      expect(formatNumberToString(1234.5, Enum.English)).toBe('1,234.50');
      expect(formatNumberToString(1234.5, Enum.Norwegian)).toBe(
        '1\u00a0234,50',
      );
    });
  });
}

runFormatNumberToStringTests(AppLanguage, 'AppLanguage');
runFormatNumberToStringTests(PlannerWebLanguage, 'PlannerWebLanguage');
