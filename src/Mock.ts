import {
  apply,
  chain as _chain,
  fromIO as _fromIO,
  functor,
  io,
  number as _number,
  option,
  ord,
  predicate,
  random,
  readonlyArray as _readonlyArray,
  readonlyNonEmptyArray as _readonlyNonEmptyArray,
  readonlyRecord as _readonlyRecord,
  semigroup,
} from 'fp-ts'
import { Applicative1 } from 'fp-ts/Applicative'
import { Apply1 } from 'fp-ts/Apply'
import { Chain1 } from 'fp-ts/Chain'
import { FromIO1 } from 'fp-ts/FromIO'
import {
  constNull,
  constUndefined,
  constVoid,
  flip,
  pipe,
} from 'fp-ts/function'
import { Functor1 } from 'fp-ts/Functor'
import { IO } from 'fp-ts/IO'
import { Monad1 } from 'fp-ts/Monad'
import { MonadIO1 } from 'fp-ts/MonadIO'
import { Pointed1 } from 'fp-ts/Pointed'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'
import { ReadonlyRecord } from 'fp-ts/ReadonlyRecord'
import * as t from 'io-ts'
import { PartialDeep } from '.'
import { curry, recurse, run } from './function'
import * as $type from './Type'
import * as $yield from './Yield'
import * as $struct from './_Struct'
import { Struct } from './_Struct'

export const URI = 'Mock'

export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly [URI]: Mock<A>
  }
}

type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R

export interface Mock<A> {
  (...as: ReadonlyArray<PartialDeep<A>>): IO<A>
}

export const Functor: Functor1<URI> = {
  URI,
  map: (fa, f) => pipe(fa(), io.map(f), FromIO.fromIO),
}

export const map = curry(flip(Functor.map))
export const flap = functor.flap(Functor)
export const bindTo = functor.bindTo(Functor)

export const Pointed: Pointed1<URI> = {
  URI,
  of:
    <A>(a: A): Mock<A> =>
    (...as) =>
      pipe(
        as,
        _readonlyNonEmptyArray.fromReadonlyArray,
        option.traverse(io.Applicative)(random.randomElem),
        io.map(
          option.match(
            () => a,
            (_a) =>
              $type.struct.is(a) && $type.struct.is(_a)
                ? (pipe(
                    _a,
                    $struct.filterDeep(predicate.not(t.undefined.is)),
                    (_a) =>
                      $struct.patch<A & Struct, PartialDeep<A & Struct>>(
                        _a as PartialDeep<A & Struct>,
                      )(a),
                  ) as A)
                : (_a as A),
          ),
        ),
      ),
}

export const of = Pointed.of
export const Do = Pointed.of({})

export const Apply: Apply1<URI> = {
  ...Functor,
  ap: (fab, fa) => Chain.chain(fab, curry(Functor.map)(fa)),
}

export const ap = curry(flip(Apply.ap))
export const apFirst = apply.apFirst(Apply)
export const apSecond = apply.apSecond(Apply)
export const apS = apply.apS(Apply)

export const Applicative: Applicative1<URI> = { ...Pointed, ...Apply }

export const Chain: Chain1<URI> = {
  ...Apply,
  chain: (fa, f) => Functor.map(Functor.map(fa, f), (fb) => fb()()),
}

export const chain = curry(flip(Chain.chain))
export const chainFirst = _chain.chainFirst(Chain)
export const bind = _chain.bind(Chain)

export const Monad: Monad1<URI> = { ...Applicative, ...Chain }

export const FromIO: FromIO1<URI> = {
  URI,
  fromIO:
    (fa) =>
    (...as) =>
      pipe(
        fa,
        io.chain((a) => Pointed.of(a)(...as)),
      ),
}

export const fromIO = FromIO.fromIO
export const fromIOK = _fromIO.fromIOK(FromIO)
export const chainIOK = _fromIO.chainIOK(FromIO, Chain)
export const chainFirstIOK = _fromIO.chainFirstIOK(FromIO, Chain)

export const MonadIO: MonadIO1<URI> = { ...Monad, ...FromIO }

const _void: Mock<void> = () => constVoid
const _undefined: Mock<undefined> = () => constUndefined
const _null: Mock<null> = () => constNull

export const boolean: Mock<boolean> = fromIO(random.randomBool)

export const float =
  (
    min = Number.MIN_SAFE_INTEGER * 1e-6,
    max = Number.MAX_SAFE_INTEGER * 1e-6,
  ): Mock<number> =>
  (...as) =>
    pipe(
      fromIO(random.randomRange(min, Math.max(min + Number.EPSILON, max)))(
        ...as,
      ),
      io.map(
        ord.clamp(_number.Ord)(
          min,
          Math.max(min + Number.EPSILON, max - Number.EPSILON),
        ),
      ),
    )

export const integer =
  (
    min = Number.MIN_SAFE_INTEGER * 1e-6,
    max = Number.MAX_SAFE_INTEGER * 1e-6,
  ): Mock<number> =>
  (...as) =>
    pipe(float(min, max)(...as), io.map(Math.floor))

export const number =
  (
    min = Number.MIN_SAFE_INTEGER * 1e-6,
    max = Number.MAX_SAFE_INTEGER * 1e-6,
  ): Mock<number> =>
  (...as) =>
    pipe(
      union(float(min, max), integer(min, max))(...as),
      io.map(
        ord.clamp(_number.Ord)(
          min,
          Math.max(min + Number.EPSILON, max - Number.EPSILON),
        ),
      ),
    )

export const string: Mock<string> = fromIO(
  () => Math.random().toString(36).split('.')[1],
)

export const literal = <A extends boolean | number | string>(a: A): Mock<A> =>
  of(a)

export const unknown = (depth = 10): Mock<unknown> =>
  recurse(
    (_unknown, _depth) =>
      (_depth < depth
        ? union(
            _undefined,
            _null,
            boolean,
            number(),
            string,
            readonlyArray(_unknown),
            readonlyRecord(string, _unknown),
          )
        : union(_undefined, _null, boolean, number(), string)) as Mock<unknown>,
  )

export const nullable = <A>(M: Mock<A>): Mock<A | undefined> =>
  union(M, _undefined)

export const tuple = apply.sequenceT(Apply)

export const struct = apply.sequenceS(Apply)

export const partial = <A>(
  Ms: EnforceNonEmptyRecord<{ readonly [K in keyof A]: Mock<A[K]> }>,
): Mock<Partial<Readonly<A>>> =>
  pipe(
    Ms as ReadonlyRecord<string, Mock<unknown>>,
    _readonlyRecord.map(nullable),
    struct,
  ) as any

export function union<A, B, C, D, E, F, G, H, I, J>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
  d: Mock<D>,
  e: Mock<E>,
  f: Mock<F>,
  g: Mock<G>,
  h: Mock<H>,
  i: Mock<I>,
  j: Mock<J>,
): Mock<A | B | C | D | E | F | G | H | I | J>
export function union<A, B, C, D, E, F, G, H, I>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
  d: Mock<D>,
  e: Mock<E>,
  f: Mock<F>,
  g: Mock<G>,
  h: Mock<H>,
  i: Mock<I>,
): Mock<A | B | C | D | E | F | G | H | I>
export function union<A, B, C, D, E, F, G, H>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
  d: Mock<D>,
  e: Mock<E>,
  f: Mock<F>,
  g: Mock<G>,
  h: Mock<H>,
): Mock<A | B | C | D | E | F | G | H>
export function union<A, B, C, D, E, F, G>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
  d: Mock<D>,
  e: Mock<E>,
  f: Mock<F>,
  g: Mock<G>,
): Mock<A | B | C | D | E | F | G>
export function union<A, B, C, D, E, F>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
  d: Mock<D>,
  e: Mock<E>,
  f: Mock<F>,
): Mock<A | B | C | D | E | F>
export function union<A, B, C, D, E>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
  d: Mock<D>,
  e: Mock<E>,
): Mock<A | B | C | D | E>
export function union<A, B, C, D>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
  d: Mock<D>,
): Mock<A | B | C | D>
export function union<A, B, C>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
): Mock<A | B | C>
export function union<A, B>(a: Mock<A>, b: Mock<B>): Mock<A | B>
export function union(...Ms: ReadonlyNonEmptyArray<Mock<unknown>>) {
  return pipe(Ms, random.randomElem, io.chain(run), fromIO)
}

export const readonlyArray = <A>(
  M: Mock<A>,
  min = 0,
  max = 10,
): Mock<ReadonlyArray<A>> =>
  pipe(
    random.randomInt(Math.max(0, min), Math.max(0, min, max)),
    io.map((n) =>
      pipe($yield.fromIO(M()), $yield.takeLeft(n), $yield.toReadonlyArray),
    ),
    fromIO,
  )

export const readonlyNonEmptyArray = <A>(
  M: Mock<A>,
  min = 1,
  max = 10,
): Mock<ReadonlyNonEmptyArray<A>> =>
  readonlyArray(M, Math.max(1, min), Math.max(1, min, max)) as unknown as Mock<
    ReadonlyNonEmptyArray<A>
  >

export const readonlyRecord = <K extends string, T>(
  KM: Mock<K>,
  TM: Mock<T>,
  min = 0,
  max = 10,
): Mock<ReadonlyRecord<K, T>> =>
  pipe(
    readonlyArray(tuple(KM, TM), Math.max(0, min), Math.max(0, min, max))(),
    io.map(
      _readonlyRecord.fromFoldable(
        semigroup.last<T>(),
        _readonlyArray.Foldable,
      ),
    ),
    fromIO,
  )

export { _void as void, _undefined as undefined, _null as null }
