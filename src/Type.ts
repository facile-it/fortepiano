import * as E from 'fp-ts/Either'
import { flow, identity, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as t from 'io-ts'
import { NumberFromString } from 'io-ts-types'
import { failure } from 'io-ts/lib/PathReporter'
import * as $Er from './Error'
import * as $S from './struct'

export const numeric = new t.Type(
  'Numeric',
  t.number.is,
  (u, c) =>
    pipe(
      t.number.validate(u, c),
      E.alt(() => NumberFromString.validate(u, c)),
    ),
  t.number.encode,
)

const isLiteral =
  (r: RegExp) =>
  (u: unknown): u is string =>
    t.string.is(u) && r.test(u)

export function literal<V extends number | string>(
  value: V,
  name?: string,
): t.LiteralC<V>
export function literal(regExp: RegExp, name?: string): t.StringC
export function literal(a: number | string | RegExp, name?: string) {
  return a instanceof RegExp
    ? new t.Type(
        name || 'Literal',
        isLiteral(a),
        (u, c) => (isLiteral(a)(u) ? t.success(u) : t.failure(u, c)),
        identity,
      )
    : t.literal(a, name)
}

const isStruct = (u: unknown): u is $S.Struct =>
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
  codec: C,
): t.Type<t.TypeOf<C>, t.OutputOf<C>, t.InputOf<C>> => ({
  ...codec,
  name,
})

const isStringArray = (
  as: ReadonlyArray<unknown>,
): as is ReadonlyArray<string> => t.string.is(as[0])

export function literalUnion<
  A extends number | string,
  B extends { readonly [K in A]: null },
>(strings: Readonly<[A, A, ...ReadonlyArray<A>]>, name?: string): t.KeyofC<B>
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

export const lax = <P extends t.Props>(props: P, name?: string) =>
  pipe(
    t.partial(props, name),
    (partial) =>
      new t.Type(
        partial.name,
        partial.is,
        flow(
          t.UnknownRecord.validate,
          E.map(RR.toReadonlyArray),
          E.map(
            RA.reduce({}, (result, [key, value]) =>
              pipe(
                partial.props,
                RR.lookup(key),
                O.match(
                  () => result, // ({ ...result, [key]: value }),
                  (codec) =>
                    pipe(
                      codec.decode(value),
                      E.match(
                        () => result,
                        (value) => ({ ...result, [key]: value }),
                      ),
                    ),
                ),
              ),
            ),
          ),
          E.chain(t.success),
        ),
        partial.encode,
      ),
  )

export const decode =
  <C extends t.Mixed>(codec: C) =>
  (u: unknown): E.Either<Error, t.TypeOf<C>> =>
    pipe(
      u,
      codec.decode,
      E.mapLeft(failure),
      E.mapLeft(RA.map(Error)),
      E.mapLeft(
        (errors) =>
          new $Er.AggregateError(
            errors,
            `Cannot decode input with codec "${codec.name}"`,
          ),
      ),
    )
