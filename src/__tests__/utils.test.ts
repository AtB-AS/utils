import {nullishToOptional} from '../utils';

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
