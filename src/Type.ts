import { identity } from 'fp-ts/function'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'
import * as t from 'io-ts'
import * as $S from './struct'

const isStruct = (u: unknown): u is $S.struct =>
  'object' === typeof u && null !== u && !Array.isArray(u)

export const struct = new t.Type(
  'struct',
  isStruct,
  (u, c) => (isStruct(u) ? t.success(u) : t.failure(u, c)),
  identity,
)

export const nullable = <C extends t.Mixed>(codec: C, name?: string) =>
  t.union([codec, t.undefined], name)

export const alias = <C extends t.Mixed>(
  name: string,
  { is, decode, encode }: C,
): t.Type<t.TypeOf<C>, t.OutputOf<C>, t.InputOf<C>> =>
  new t.Type(name, is, decode, encode)

const isStringArray = (
  as: ReadonlyArray<unknown>,
): as is ReadonlyArray<string> => t.string.is(as[0])

export function literalUnion<
  A extends number | string,
  B extends { [K in A]: null },
>(strings: [A, A, ...ReadonlyArray<A>], name?: string): t.KeyofC<B>
export function literalUnion(
  as: ReadonlyNonEmptyArray<number> | ReadonlyNonEmptyArray<string>,
  name?: string,
) {
  return isStringArray(as)
    ? t.keyof(
        as.reduce((result, string) => ({ ...result, [string]: null }), {}),
        name,
      )
    : t.union(as.map((number) => t.literal(number)) as any, name)
}
