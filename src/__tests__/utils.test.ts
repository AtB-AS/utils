import {nullishToOptional, formatNumberToString} from '../utils';

enum AppLanguage {
  Norwegian = 'nb',
  English = 'en',
  Nynorsk = 'nn',
}

enum PlannerWebLanguage {
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

    it('should show decimals on whole numbers if minDigits is set', () => {
      expect(formatNumberToString(11.0, Enum.Norwegian, 2)).toBe('11,00');
      expect(formatNumberToString(11, Enum.Norwegian, 2)).toBe('11,00');
      expect(formatNumberToString(11.0, Enum.Norwegian, 2, 3)).toBe('11,00');
      expect(formatNumberToString(11, Enum.Norwegian, 2, 3)).toBe('11,00');
    });

    it('should show number of decimals up to given maxDigits on decimal numbers', () => {
      expect(formatNumberToString(10.2, Enum.Norwegian, undefined, 3)).toBe(
        '10,20',
      );
      expect(formatNumberToString(10.23, Enum.Norwegian, undefined, 3)).toBe(
        '10,23',
      );
      expect(formatNumberToString(10.233, Enum.Norwegian, undefined, 3)).toBe(
        '10,233',
      );
      expect(formatNumberToString(10.237, Enum.Norwegian, undefined, 3)).toBe(
        '10,237',
      );
      expect(formatNumberToString(10.2346, Enum.Norwegian, undefined, 3)).toBe(
        '10,235',
      );
    });

    it('should always round to whole number when minDigits and maxDigits are 0', () => {
      expect(formatNumberToString(10.2, Enum.Norwegian, 0, 0)).toBe('10');
      expect(formatNumberToString(10.23, Enum.Norwegian, 0, 0)).toBe('10');
      expect(formatNumberToString(10.233, Enum.Norwegian, 0, 0)).toBe('10');
      expect(formatNumberToString(10.237, Enum.Norwegian, 0, 0)).toBe('10');
    });

    it('should always show 3 digits', () => {
      expect(formatNumberToString(10.2, Enum.Norwegian, 3, 3)).toBe('10,200');
      expect(formatNumberToString(10.23, Enum.Norwegian, 3, 3)).toBe('10,230');
      expect(formatNumberToString(10.233, Enum.Norwegian, 3, 3)).toBe('10,233');
      expect(formatNumberToString(10.2376, Enum.Norwegian, 3, 3)).toBe(
        '10,238',
      );
    });

    it('should always show 1 digit', () => {
      expect(formatNumberToString(10, Enum.Norwegian, 1, 1)).toBe('10,0');
      expect(formatNumberToString(10.23, Enum.Norwegian, 1, 1)).toBe('10,2');
      expect(formatNumberToString(10.233, Enum.Norwegian, 1, 1)).toBe('10,2');
    });

    it('should show max 1 digit', () => {
      expect(formatNumberToString(10, Enum.Norwegian, 0, 1)).toBe('10');
      expect(formatNumberToString(10.2, Enum.Norwegian, 0, 1)).toBe('10,2');
      expect(formatNumberToString(10.233, Enum.Norwegian, 0, 1)).toBe('10,2');
    });
  });
}

runFormatNumberToStringTests(AppLanguage, 'AppLanguage');
runFormatNumberToStringTests(PlannerWebLanguage, 'PlannerWebLanguage');
