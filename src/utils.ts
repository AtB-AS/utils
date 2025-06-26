/**
 * For use in cases where you want a value to be "optional" / `T | undefined`,
 * but have to accept `null`.
 *
 * @example
 * ```ts
 * const Foo =  z.string().nullish().transform(nullishToOptional)
 * type Foo = z.infer<typeof Foo>; // `type Foo = string | undefined`
 * ```
 */
export function nullishToOptional<T>(
  value: T | null | undefined,
): T | undefined {
  return value ?? undefined;
}
