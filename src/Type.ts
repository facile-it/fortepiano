import { identity } from 'fp-ts/function'
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

export const alias = <C extends t.Mixed>(
  name: string,
  { is, decode, encode }: C,
): t.Type<t.TypeOf<C>, t.OutputOf<C>, t.InputOf<C>> =>
  new t.Type(name, is, decode, encode)

export const isStringArray = (
  as: ReadonlyArray<unknown>,
): as is ReadonlyArray<string> => t.string.is(as[0])

export function literalUnion<A extends string>(
  strings: [A, A, ...ReadonlyArray<A>],
  name?: string,
): t.KeyofC<{ readonly [K in A]: null }>
export function literalUnion<A extends number>(
  numbers: [A, A, ...ReadonlyArray<A>],
  name?: string,
): t.UnionC<
  [t.LiteralC<A>, t.LiteralC<A>] & { readonly [K: number]: t.LiteralC<A> }
>
export function literalUnion(
  as: ReadonlyArray<number> | ReadonlyArray<string>,
  name?: string,
) {
  return isStringArray(as)
    ? t.keyof(
        as.reduce((result, string) => ({ ...result, [string]: null }), {}),
        name,
      )
    : t.union(as.map((number) => t.literal(number)) as any, name)
}
