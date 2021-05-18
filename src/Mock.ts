import {
  apply,
  chain,
  fromIO,
  functor,
  io,
  number,
  option,
  ord,
  random,
  readonlyArray,
  readonlyNonEmptyArray,
  readonlyRecord,
  semigroup,
} from 'fp-ts'
import { Applicative1 } from 'fp-ts/Applicative'
import { Apply1 } from 'fp-ts/Apply'
import { Chain1 } from 'fp-ts/Chain'
import { FromIO1 } from 'fp-ts/FromIO'
import { flip, not, pipe } from 'fp-ts/function'
import { Functor1 } from 'fp-ts/Functor'
import { IO } from 'fp-ts/IO'
import { Monad1 } from 'fp-ts/Monad'
import { MonadIO1 } from 'fp-ts/MonadIO'
import { Pointed1 } from 'fp-ts/Pointed'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'
import { ReadonlyRecord } from 'fp-ts/ReadonlyRecord'
import { PartialDeep } from '.'
import { curry, recurse, run } from './function'
import { struct } from './struct'

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

const Functor: Functor1<URI> = {
  URI,
  map: (fa, f) => pipe(fa(), io.map(f), FromIO.fromIO),
}

const map = curry(flip(Functor.map))
const flap = functor.flap(Functor)
const bindTo = functor.bindTo(Functor)

const isUndefined = (a: unknown): a is undefined => undefined === a
const isObject = <A>(a: A): a is A & object =>
  null !== a && 'object' === typeof a && !Array.isArray(a)

const Pointed: Pointed1<URI> = {
  URI,
  of: <A>(a: A): Mock<A> => (...as) =>
    pipe(
      as,
      readonlyNonEmptyArray.fromReadonlyArray,
      option.map(random.randomElem),
      option.sequence(io.Applicative),
      io.map(
        option.match(
          () => a,
          (_a) =>
            isObject(a) && isObject(_a)
              ? (pipe(_a, struct.filterDeep(not(isUndefined)), (_a) =>
                  struct.patch<A & object, PartialDeep<A & object>>(
                    _a as PartialDeep<A & object>
                  )(a)
                ) as A)
              : (_a as A)
        )
      )
    ),
}

const of = Pointed.of
const Do = Pointed.of({})

const Apply: Apply1<URI> = {
  ...Functor,
  ap: (fab, fa) => Chain.chain(fab, curry(Functor.map)(fa)),
}

const ap = curry(flip(Apply.ap))
const apFirst = apply.apFirst(Apply)
const apSecond = apply.apSecond(Apply)
const apS = apply.apS(Apply)

const Applicative: Applicative1<URI> = { ...Pointed, ...Apply }

const Chain: Chain1<URI> = {
  ...Apply,
  chain: (fa, f) => Functor.map(Functor.map(fa, f), (fb) => fb()()),
}

const _chain = curry(flip(Chain.chain))
const chainFirst = chain.chainFirst(Chain)
const bind = chain.bind(Chain)

const Monad: Monad1<URI> = { ...Applicative, ...Chain }

const FromIO: FromIO1<URI> = {
  URI,
  fromIO: (fa) => (...as) =>
    pipe(
      fa,
      io.chain((a) => Pointed.of(a)(...as))
    ),
}

const _fromIO = FromIO.fromIO
const fromIOK = fromIO.fromIOK(FromIO)
const chainIOK = fromIO.chainIOK(FromIO, Chain)
const chainFirstIOK = fromIO.chainFirstIOK(FromIO, Chain)

const MonadIO: MonadIO1<URI> = { ...Monad, ...FromIO }

const _undefined: Mock<undefined> = () => () => undefined
const _null: Mock<null> = () => () => null
const boolean: Mock<boolean> = _fromIO(random.randomBool)

const float = (
  min = Number.MIN_SAFE_INTEGER * 1e-6,
  max = Number.MAX_SAFE_INTEGER * 1e-6
): Mock<number> => (...as) =>
  pipe(
    _fromIO(random.randomRange(min, Math.max(min + Number.EPSILON, max)))(
      ...as
    ),
    io.map(
      ord.clamp(number.Ord)(
        min,
        Math.max(min + Number.EPSILON, max - Number.EPSILON)
      )
    )
  )

const integer = (
  min = Number.MIN_SAFE_INTEGER * 1e-6,
  max = Number.MAX_SAFE_INTEGER * 1e-6
): Mock<number> => (...as) => pipe(float(min, max)(...as), io.map(Math.floor))

const _number = (
  min = Number.MIN_SAFE_INTEGER * 1e-6,
  max = Number.MAX_SAFE_INTEGER * 1e-6
): Mock<number> => (...as) =>
  pipe(
    union(float(min, max), integer(min, max))(...as),
    io.map(
      ord.clamp(number.Ord)(
        min,
        Math.max(min + Number.EPSILON, max - Number.EPSILON)
      )
    )
  )

const string: Mock<string> = _fromIO(
  () => Math.random().toString(36).split('.')[1]
)

const unknown = (depth = 10): Mock<unknown> =>
  recurse(
    (_unknown, _depth) =>
      (_depth < depth
        ? union(
            _undefined,
            _null,
            boolean,
            _number(),
            string,
            _readonlyArray(_unknown),
            _readonlyRecord(string, _unknown)
          )
        : union(_undefined, _null, boolean, _number(), string)) as Mock<unknown>
  )

const nullable = <A>(M: Mock<A>): Mock<A | undefined> => union(M, _undefined)
const literal = <A extends boolean | number | string>(a: A): Mock<A> => of(a)

const _struct = apply.sequenceS(Apply)
const _tuple = apply.sequenceT(Apply)

const partial = <A>(
  Ms: EnforceNonEmptyRecord<{ readonly [K in keyof A]: Mock<A[K]> }>
): Mock<Partial<Readonly<A>>> =>
  pipe(
    Ms as ReadonlyRecord<string, Mock<unknown>>,
    readonlyRecord.map(nullable),
    _struct
  ) as any

function union<A, B, C, D, E, F, G, H, I, J>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
  d: Mock<D>,
  e: Mock<E>,
  f: Mock<F>,
  g: Mock<G>,
  h: Mock<H>,
  i: Mock<I>,
  j: Mock<J>
): Mock<A | B | C | D | E | F | G | H | I | J>
function union<A, B, C, D, E, F, G, H, I>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
  d: Mock<D>,
  e: Mock<E>,
  f: Mock<F>,
  g: Mock<G>,
  h: Mock<H>,
  i: Mock<I>
): Mock<A | B | C | D | E | F | G | H | I>
function union<A, B, C, D, E, F, G, H>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
  d: Mock<D>,
  e: Mock<E>,
  f: Mock<F>,
  g: Mock<G>,
  h: Mock<H>
): Mock<A | B | C | D | E | F | G | H>
function union<A, B, C, D, E, F, G>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
  d: Mock<D>,
  e: Mock<E>,
  f: Mock<F>,
  g: Mock<G>
): Mock<A | B | C | D | E | F | G>
function union<A, B, C, D, E, F>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
  d: Mock<D>,
  e: Mock<E>,
  f: Mock<F>
): Mock<A | B | C | D | E | F>
function union<A, B, C, D, E>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
  d: Mock<D>,
  e: Mock<E>
): Mock<A | B | C | D | E>
function union<A, B, C, D>(
  a: Mock<A>,
  b: Mock<B>,
  c: Mock<C>,
  d: Mock<D>
): Mock<A | B | C | D>
function union<A, B, C>(a: Mock<A>, b: Mock<B>, c: Mock<C>): Mock<A | B | C>
function union<A, B>(a: Mock<A>, b: Mock<B>): Mock<A | B>
function union(...Ms: ReadonlyNonEmptyArray<Mock<unknown>>) {
  return pipe(Ms, random.randomElem, io.chain(run), _fromIO)
}

const _readonlyArray = <A>(
  M: Mock<A>,
  min = 0,
  max = 10
): Mock<ReadonlyArray<A>> =>
  pipe(
    random.randomInt(Math.max(0, min), Math.max(0, min, max)),
    io.map(curry(flip(readonlyArray.replicate))(M())),
    io.chain(readonlyArray.sequence(io.Applicative)),
    _fromIO
  )

const _readonlyNonEmptyArray = <A>(
  M: Mock<A>,
  min = 1,
  max = 10
): Mock<ReadonlyNonEmptyArray<A>> =>
  (_readonlyArray(
    M,
    Math.max(1, min),
    Math.max(1, min, max)
  ) as unknown) as Mock<ReadonlyNonEmptyArray<A>>

const _readonlyRecord = <K extends string, T>(
  KM: Mock<K>,
  TM: Mock<T>,
  min = 0,
  max = 10
): Mock<ReadonlyRecord<K, T>> =>
  pipe(
    _readonlyArray(_tuple(KM, TM), Math.max(0, min), Math.max(0, min, max))(),
    io.map(
      readonlyRecord.fromFoldable(semigroup.last<T>(), readonlyArray.Foldable)
    ),
    _fromIO
  )

export const mock = {
  undefined: _undefined,
  null: _null,
  boolean,
  float,
  integer,
  number: _number,
  string,
  unknown,
  nullable,
  literal,
  struct: _struct,
  tuple: _tuple,
  partial,
  union,
  readonlyArray: _readonlyArray,
  readonlyNonEmptyArray: _readonlyNonEmptyArray,
  readonlyRecord: _readonlyRecord,
  map,
  flap,
  bindTo,
  of,
  Do,
  ap,
  apFirst,
  apSecond,
  apS,
  chain: _chain,
  chainFirst,
  bind,
  fromIO: _fromIO,
  fromIOK,
  chainIOK,
  chainFirstIOK,
  Functor,
  Pointed,
  Apply,
  Applicative,
  Chain,
  Monad,
  FromIO,
  MonadIO,
}
