import * as _Alt from 'fp-ts/Alt'
import * as Alte from 'fp-ts/Alternative'
import * as Appli from 'fp-ts/Applicative'
import * as _Apply from 'fp-ts/Apply'
import * as Ch from 'fp-ts/Chain'
import * as Co from 'fp-ts/Compactable'
import * as Ei from 'fp-ts/Either'
import * as Eq from 'fp-ts/Eq'
import * as Fi from 'fp-ts/Filterable'
import * as FiWI from 'fp-ts/FilterableWithIndex'
import * as Fo from 'fp-ts/Foldable'
import * as FoWI from 'fp-ts/FoldableWithIndex'
import * as FIO from 'fp-ts/FromIO'
import {
  constFalse,
  constTrue,
  flip,
  flow,
  Lazy,
  not,
  pipe,
  Predicate,
  Refinement,
} from 'fp-ts/function'
import * as Fu from 'fp-ts/Functor'
import * as FuWI from 'fp-ts/FunctorWithIndex'
import {
  HKT,
  Kind,
  Kind2,
  Kind3,
  Kind4,
  URIS,
  URIS2,
  URIS3,
  URIS4,
} from 'fp-ts/HKT'
import * as IO from 'fp-ts/IO'
import * as Mona from 'fp-ts/Monad'
import * as MIO from 'fp-ts/MonadIO'
import * as Mono from 'fp-ts/Monoid'
import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Pointed'
import * as R from 'fp-ts/Random'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as S from 'fp-ts/Separated'
import * as T from 'fp-ts/Traversable'
import * as TWI from 'fp-ts/TraversableWithIndex'
import { Int } from 'io-ts'
import { curry } from './function'

export const URI = 'IOGenerator'

export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    [URI]: IOGenerator<A>
  }
}

export type IOGenerator<A> = IO.IO<Generator<A>>

export const getMonoid = <A>(): Mono.Monoid<IOGenerator<A>> => ({
  empty: fromReadonlyArray([]),
  concat: (x, y) =>
    function* () {
      yield* x()
      yield* y()
    },
})

export const Functor: Fu.Functor1<URI> = {
  URI,
  map: (fa, f) =>
    function* () {
      for (const a of fa()) {
        yield f(a)
      }
    },
}

export const map = curry(flip(Functor.map))
export const flap = Fu.flap(Functor)
export const bindTo = Fu.bindTo(Functor)

export const Pointed: P.Pointed1<URI> = {
  URI,
  of: (a) =>
    function* () {
      yield a
    },
}

export const of = Pointed.of
export const Do = Pointed.of({})

export const FunctorWithIndex: FuWI.FunctorWithIndex1<URI, number> = {
  ...Functor,
  mapWithIndex: (fa, f) =>
    Functor.map(pipe(fa, zip(range(0))), ([a, i]) => f(i, a)),
}

export const Apply: _Apply.Apply1<URI> = {
  ...Functor,
  ap: (fab, fa) => Chain.chain(fab, curry(Functor.map)(fa)),
}

export const ap = curry(flip(Apply.ap))
export const apFirst = _Apply.apFirst(Apply)
export const apSecond = _Apply.apSecond(Apply)
export const apS = _Apply.apS(Apply)

export const Applicative: Appli.Applicative1<URI> = { ...Pointed, ...Apply }

export const Chain: Ch.Chain1<URI> = {
  ...Apply,
  chain: (fa, f) => flatten(Functor.map(fa, f)),
}

export const chain = curry(flip(Chain.chain))
export const chainFirst = Ch.chainFirst(Chain)
export const bind = Ch.bind(Chain)

export const Monad: Mona.Monad1<URI> = { ...Applicative, ...Chain }

export const FromIO: FIO.FromIO1<URI> = {
  URI,
  fromIO: (fa) => () => Pointed.of(fa())(),
}

export const fromIO = FromIO.fromIO
export const fromIOK = FIO.fromIOK(FromIO)
export const chainIOK = FIO.chainIOK(FromIO, Chain)
export const chainFirstIOK = FIO.chainFirstIOK(FromIO, Chain)

export const fromIOReadonlyArray = <A>(
  fa: IO.IO<ReadonlyArray<A>>,
): IOGenerator<A> => pipe(fa, fromIO, chain(fromReadonlyArray))

export const fromIOReadonlyArrayK = <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IO.IO<ReadonlyArray<B>>,
) => flow(f, fromIOReadonlyArray)

export const chainIOReadonlyArrayK = <A, B>(
  f: (a: A) => IO.IO<ReadonlyArray<B>>,
) => chain(fromIOReadonlyArrayK(f))

export const MonadIO: MIO.MonadIO1<URI> = { ...Monad, ...FromIO }

export const Alt: _Alt.Alt1<URI> = {
  ...Functor,
  alt: <A>(fa: IOGenerator<A>, that: Lazy<IOGenerator<A>>) =>
    getMonoid<A>().concat(fa, that()),
}

export const alt = curry(flip(Alt.alt))

export const Alternative: Alte.Alternative1<URI> = {
  ...Applicative,
  ...Alt,
  zero: <A>() => getMonoid<A>().empty,
}

export const zero = Alternative.zero

export const Compactable: Co.Compactable1<URI> = {
  URI,
  compact: (fa) => Functor.map(Filterable.filter(fa, O.isSome), (a) => a.value),
  separate: (fa) =>
    S.separated(
      Functor.map(Filterable.filter(fa, Ei.isLeft), (a) => a.left),
      Functor.map(Filterable.filter(fa, Ei.isRight), (a) => a.right),
    ),
}

export const compact = Compactable.compact
export const separate = Compactable.separate

function _filter<A, B extends A>(
  fa: IOGenerator<A>,
  refinement: Refinement<A, B>,
): IOGenerator<B>
function _filter<A>(fa: IOGenerator<A>, predicate: Predicate<A>): IOGenerator<A>
function _filter<A>(fa: IOGenerator<A>, predicate: Predicate<A>) {
  return function* () {
    for (const a of fa()) {
      if (!predicate(a)) {
        continue
      }

      yield a
    }
  }
}

function _partition<A, B extends A>(
  fa: IOGenerator<A>,
  refinement: Refinement<A, B>,
): S.Separated<IOGenerator<A>, IOGenerator<B>>
function _partition<A>(
  fa: IOGenerator<A>,
  predicate: Predicate<A>,
): S.Separated<IOGenerator<A>, IOGenerator<A>>
function _partition<A>(fa: IOGenerator<A>, predicate: Predicate<A>) {
  return S.separated(
    Filterable.filter(fa, not(predicate)),
    Filterable.filter(fa, predicate),
  )
}

export const Filterable: Fi.Filterable1<URI> = {
  ...Functor,
  ...Compactable,
  filter: _filter,
  filterMap: (fa, f) => Compactable.compact(Functor.map(fa, f)),
  partition: _partition,
  partitionMap: (fa, f) => Compactable.separate(Functor.map(fa, f)),
}

export function filter<A, B extends A>(
  refinement: Refinement<A, B>,
): (fa: IOGenerator<A>) => IOGenerator<B>
export function filter<A>(
  predicate: Predicate<A>,
): (fa: IOGenerator<A>) => IOGenerator<A>
export function filter<A>(predicate: Predicate<A>) {
  return (fa: IOGenerator<A>) => Filterable.filter(fa, predicate)
}
export const filterMap = curry(flip(Filterable.filterMap))
export function partition<A, B extends A>(
  refinement: Refinement<A, B>,
): (fa: IOGenerator<A>) => S.Separated<IOGenerator<A>, IOGenerator<B>>
export function partition<A>(
  predicate: Predicate<A>,
): (fa: IOGenerator<A>) => S.Separated<IOGenerator<A>, IOGenerator<A>>
export function partition<A>(predicate: Predicate<A>) {
  return (fa: IOGenerator<A>) => Filterable.partition(fa, predicate)
}
export const partitionMap = curry(flip(Filterable.partitionMap))

function _filterWithIndex<A, B extends A>(
  fa: IOGenerator<A>,
  refinementWithIndex: (i: number, a: A) => a is B,
): IOGenerator<B>
function _filterWithIndex<A>(
  fa: IOGenerator<A>,
  predicateWithIndex: (i: number, a: A) => boolean,
): IOGenerator<A>
function _filterWithIndex<A>(
  fa: IOGenerator<A>,
  predicateWithIndex: (i: number, a: A) => boolean,
) {
  return Compactable.compact(
    FunctorWithIndex.mapWithIndex(fa, (i, a) =>
      predicateWithIndex(i, a) ? O.some(a) : O.none,
    ),
  )
}

function _partitionWithIndex<A, B extends A>(
  fa: IOGenerator<A>,
  refinementWithIndex: (i: number, a: A) => a is B,
): S.Separated<IOGenerator<A>, IOGenerator<B>>
function _partitionWithIndex<A>(
  fa: IOGenerator<A>,
  predicateWithIndex: (i: number, a: A) => boolean,
): S.Separated<IOGenerator<A>, IOGenerator<A>>
function _partitionWithIndex<A>(
  fa: IOGenerator<A>,
  predicateWithIndex: (i: number, a: A) => boolean,
) {
  return Compactable.separate(
    FunctorWithIndex.mapWithIndex(fa, (i, a) =>
      predicateWithIndex(i, a) ? Ei.right(a) : Ei.left(a),
    ),
  )
}

export const FilterableWithIndex: FiWI.FilterableWithIndex1<URI, number> = {
  ...FunctorWithIndex,
  ...Filterable,
  filterWithIndex: _filterWithIndex,
  filterMapWithIndex: (fa, f) =>
    Compactable.compact(FunctorWithIndex.mapWithIndex(fa, f)),
  partitionWithIndex: _partitionWithIndex,
  partitionMapWithIndex: (fa, f) =>
    Compactable.separate(FunctorWithIndex.mapWithIndex(fa, f)),
}

export function filterWithIndex<A, B extends A>(
  refinementWithIndex: (i: number, a: A) => a is B,
): (fa: IOGenerator<A>) => IOGenerator<B>
export function filterWithIndex<A>(
  predicateWithIndex: (i: number, a: A) => boolean,
): (fa: IOGenerator<A>) => IOGenerator<A>
export function filterWithIndex<A>(
  predicateWithIndex: (i: number, a: A) => boolean,
) {
  return (fa: IOGenerator<A>) =>
    FilterableWithIndex.filterWithIndex(fa, predicateWithIndex)
}
export const filterMapWithIndex = curry(
  flip(FilterableWithIndex.filterMapWithIndex),
)
export function partitionWithIndex<A, B extends A>(
  refinementWithIndex: (i: number, a: A) => a is B,
): (fa: IOGenerator<A>) => S.Separated<IOGenerator<A>, IOGenerator<B>>
export function partitionWithIndex<A>(
  predicateWithIndex: (i: number, a: A) => boolean,
): (fa: IOGenerator<A>) => S.Separated<IOGenerator<A>, IOGenerator<A>>
export function partitionWithIndex<A>(
  predicateWithIndex: (i: number, a: A) => boolean,
) {
  return (fa: IOGenerator<A>) =>
    FilterableWithIndex.partitionWithIndex(fa, predicateWithIndex)
}
export const partitionMapWithIndex = curry(
  flip(FilterableWithIndex.partitionMapWithIndex),
)

export const Foldable: Fo.Foldable1<URI> = {
  URI,
  reduce: (fa, b, f) =>
    FoldableWithIndex.reduceWithIndex(fa, b, (_, _b, a) => f(_b, a)),
  foldMap: (M) => (fa, f) =>
    FoldableWithIndex.foldMapWithIndex(M)(fa, (_, a) => f(a)),
  reduceRight: (fa, b, f) =>
    FoldableWithIndex.reduceRightWithIndex(fa, b, (_, a, _b) => f(a, _b)),
}

export const reduce =
  <A, B>(b: B, f: (b: B, a: A) => B) =>
  (fa: IOGenerator<A>) =>
    Foldable.reduce(fa, b, f)
export const foldMap =
  <M>(M: Mono.Monoid<M>) =>
  <A>(f: (a: A) => M) =>
  (fa: IOGenerator<A>) =>
    Foldable.foldMap(M)(fa, f)
export const reduceRight =
  <A, B>(b: B, f: (a: A, b: B) => B) =>
  (fa: IOGenerator<A>) =>
    Foldable.reduceRight(fa, b, f)

export const FoldableWithIndex: FoWI.FoldableWithIndex1<URI, number> = {
  ...Foldable,
  reduceWithIndex: (fa, b, f) =>
    pipe(fa, zip(range(0)), (_fa) => {
      let _b = b
      for (const [a, i] of _fa()) {
        _b = f(i, _b, a)
      }

      return _b
    }),
  foldMapWithIndex: (M) => (fa, f) =>
    FoldableWithIndex.reduceWithIndex(fa, M.empty, (i, b, a) =>
      M.concat(b, f(i, a)),
    ),
  reduceRightWithIndex: (fa, b, f) =>
    pipe(fa, toReadonlyArray, RA.reduceRightWithIndex(b, f)),
}

export const reduceWithIndex =
  <A, B>(b: B, f: (i: number, b: B, a: A) => B) =>
  (fa: IOGenerator<A>) =>
    FoldableWithIndex.reduceWithIndex(fa, b, f)
export const foldMapWithIndex =
  <M>(M: Mono.Monoid<M>) =>
  <A>(f: (i: number, a: A) => M) =>
  (fa: IOGenerator<A>) =>
    FoldableWithIndex.foldMapWithIndex(M)(fa, f)
export const reduceRightWithIndex =
  <A, B>(b: B, f: (i: number, a: A, b: B) => B) =>
  (fa: IOGenerator<A>) =>
    FoldableWithIndex.reduceRightWithIndex(fa, b, f)

function _traverse<F extends URIS4>(
  F: Appli.Applicative4<F>,
): <A, S, R, E, B>(
  ta: IOGenerator<A>,
  f: (a: A) => Kind4<F, S, R, E, B>,
) => Kind4<F, S, R, E, IOGenerator<B>>
function _traverse<F extends URIS3>(
  F: Appli.Applicative3<F>,
): <A, R, E, B>(
  ta: IOGenerator<A>,
  f: (a: A) => Kind3<F, R, E, B>,
) => Kind3<F, R, E, IOGenerator<B>>
function _traverse<F extends URIS3, E>(
  F: Appli.Applicative3C<F, E>,
): <A, R, B>(
  ta: IOGenerator<A>,
  f: (a: A) => Kind3<F, R, E, B>,
) => Kind3<F, R, E, IOGenerator<B>>
function _traverse<F extends URIS2>(
  F: Appli.Applicative2<F>,
): <A, E, B>(
  ta: IOGenerator<A>,
  f: (a: A) => Kind2<F, E, B>,
) => Kind2<F, E, IOGenerator<B>>
function _traverse<F extends URIS2, E>(
  F: Appli.Applicative2C<F, E>,
): <A, B>(
  ta: IOGenerator<A>,
  f: (a: A) => Kind2<F, E, B>,
) => Kind2<F, E, IOGenerator<B>>
function _traverse<F extends URIS>(
  F: Appli.Applicative1<F>,
): <A, B>(
  ta: IOGenerator<A>,
  f: (a: A) => Kind<F, B>,
) => Kind<F, IOGenerator<B>>
function _traverse<F>(F: Appli.Applicative<F>) {
  return <A, B>(ta: IOGenerator<A>, f: (a: A) => HKT<F, B>) =>
    TraversableWithIndex.traverseWithIndex(F)(ta, (_: number, a: A) => f(a))
}

function _sequence<F extends URIS4>(
  F: Appli.Applicative4<F>,
): <S, R, E, A>(
  ta: IOGenerator<Kind4<F, S, R, E, A>>,
) => Kind4<F, S, R, E, IOGenerator<A>>
function _sequence<F extends URIS3>(
  F: Appli.Applicative3<F>,
): <R, E, A>(
  ta: IOGenerator<Kind3<F, R, E, A>>,
) => Kind3<F, R, E, IOGenerator<A>>
function _sequence<F extends URIS3, E>(
  F: Appli.Applicative3C<F, E>,
): <R, A>(ta: IOGenerator<Kind3<F, R, E, A>>) => Kind3<F, R, E, IOGenerator<A>>
function _sequence<F extends URIS2>(
  F: Appli.Applicative2<F>,
): <E, A>(ta: IOGenerator<Kind2<F, E, A>>) => Kind2<F, E, IOGenerator<A>>
function _sequence<F extends URIS2, E>(
  F: Appli.Applicative2C<F, E>,
): <A>(ta: IOGenerator<Kind2<F, E, A>>) => Kind2<F, E, IOGenerator<A>>
function _sequence<F extends URIS>(
  F: Appli.Applicative1<F>,
): <A>(ta: IOGenerator<Kind<F, A>>) => Kind<F, IOGenerator<A>>
function _sequence<F>(
  F: Appli.Applicative<F>,
): <A>(ta: IOGenerator<HKT<F, A>>) => HKT<F, IOGenerator<A>> {
  return <A>(ta: IOGenerator<HKT<F, A>>) =>
    Foldable.reduce(ta, F.of(zero<A>()), (fas, fa) =>
      F.ap(
        F.map(fas, (fa) => (a: A) => Alt.alt(fa, () => of(a))),
        fa,
      ),
    )
}

export const Traversable: T.Traversable1<URI> = {
  ...Functor,
  ...Foldable,
  traverse: _traverse,
  sequence: _sequence,
}

function _traverseWithIndex<F extends URIS4>(
  F: Appli.Applicative4<F>,
): <A, S, R, E, B>(
  ta: IOGenerator<A>,
  f: (i: number, a: A) => Kind4<F, S, R, E, B>,
) => Kind4<F, S, R, E, IOGenerator<B>>
function _traverseWithIndex<F extends URIS3>(
  F: Appli.Applicative3<F>,
): <A, R, E, B>(
  ta: IOGenerator<A>,
  f: (i: number, a: A) => Kind3<F, R, E, B>,
) => Kind3<F, R, E, IOGenerator<B>>
function _traverseWithIndex<F extends URIS3, E>(
  F: Appli.Applicative3C<F, E>,
): <A, R, B>(
  ta: IOGenerator<A>,
  f: (i: number, a: A) => Kind3<F, R, E, B>,
) => Kind3<F, R, E, IOGenerator<B>>
function _traverseWithIndex<F extends URIS2>(
  F: Appli.Applicative2<F>,
): <A, E, B>(
  ta: IOGenerator<A>,
  f: (i: number, a: A) => Kind2<F, E, B>,
) => Kind2<F, E, IOGenerator<B>>
function _traverseWithIndex<F extends URIS2, E>(
  F: Appli.Applicative2C<F, E>,
): <A, B>(
  ta: IOGenerator<A>,
  f: (i: number, a: A) => Kind2<F, E, B>,
) => Kind2<F, E, IOGenerator<B>>
function _traverseWithIndex<F extends URIS>(
  F: Appli.Applicative1<F>,
): <A, B>(
  ta: IOGenerator<A>,
  f: (i: number, a: A) => Kind<F, B>,
) => Kind<F, IOGenerator<B>>
function _traverseWithIndex<F>(F: Appli.Applicative<F>) {
  return <A, B>(ta: IOGenerator<A>, f: (i: number, a: A) => HKT<F, B>) =>
    FoldableWithIndex.reduceWithIndex(ta, F.of(zero<B>()), (i, fbs, a) =>
      F.ap(
        F.map(fbs, (bs) => (b: B) => Alt.alt(bs, () => of(b))),
        f(i, a),
      ),
    )
}

export const TraversableWithIndex: TWI.TraversableWithIndex1<URI, number> = {
  ...FunctorWithIndex,
  ...FoldableWithIndex,
  ...Traversable,
  traverseWithIndex: _traverseWithIndex,
}

export const range = (start: number): IOGenerator<number> =>
  function* () {
    for (let i = start; true; i++) {
      yield i
    }
  }

export const replicate = <A>(a: A): IOGenerator<A> =>
  pipe(
    range(0),
    map(() => a),
  )

export const fromReadonlyArray = <A>(as: ReadonlyArray<A>): IOGenerator<A> =>
  function* () {
    for (const a of as) {
      yield a
    }
  }

export const random: IOGenerator<number> = pipe(range(0), map(R.random))

export const randomInt = (low: number, high: number): IOGenerator<Int> =>
  pipe(
    range(0),
    map(
      pipe(
        R.randomInt(
          Math.floor(low),
          Math.max(Math.floor(low), Math.floor(high)),
        ),
        IO.map((a) => Math.floor(a)),
      ) as IO.IO<Int>,
    ),
  )

export const randomRange = (min: number, max: number): IOGenerator<number> =>
  pipe(range(0), map(R.randomRange(min, Math.max(min, max))))

export const randomBool: IOGenerator<boolean> = pipe(
  range(0),
  map(R.randomBool),
)

export const randomElem = <A>(
  as: RNEA.ReadonlyNonEmptyArray<A>,
): IOGenerator<A> => pipe(range(0), map(R.randomElem(as)))

export const sieve =
  <A>(f: (init: ReadonlyArray<A>, a: A) => boolean) =>
  (ma: IOGenerator<A>): IOGenerator<A> =>
    function* () {
      const init: Array<A> = []
      for (const a of ma()) {
        if (!f(init, a)) {
          continue
        }

        init.push(a)
        yield a
      }
    }

export const prime: IOGenerator<number> = pipe(
  range(2),
  sieve((init, a) =>
    pipe(
      init,
      RA.every((_a) => 0 !== a % _a),
    ),
  ),
)

export const exp: IOGenerator<number> = pipe(
  range(0),
  map((n) => Math.exp(n)),
)

export const fibonacci: IOGenerator<number> = function* () {
  for (let as = [1, 0] as [number, number]; true; as = [as[1], as[0] + as[1]]) {
    yield as[1]
  }
}

export const flatten = <A>(mma: IOGenerator<IOGenerator<A>>): IOGenerator<A> =>
  function* () {
    for (const ma of mma()) {
      yield* ma()
    }
  }

export const take =
  <A>(n: number) =>
  (ma: IOGenerator<A>): IOGenerator<A> =>
    function* () {
      for (const [a, i] of pipe(ma, zip(range(0)))()) {
        if (i >= n) {
          break
        }

        yield a
      }
    }

export const drop =
  <A>(n: number) =>
  (ma: IOGenerator<A>): IOGenerator<A> =>
    function* () {
      for (const [a, i] of pipe(ma, zip(range(0)))()) {
        if (i < n) {
          continue
        }

        yield a
      }
    }

export const zip =
  <A, B>(mb: IOGenerator<B>) =>
  (ma: IOGenerator<A>): IOGenerator<Readonly<[A, B]>> =>
    function* () {
      const bs = mb()
      for (const a of ma()) {
        const b = bs.next()
        if (b.done) {
          break
        }

        yield [a, b.value] as const
      }
    }

export const uniq = <A>(E: Eq.Eq<A>) =>
  sieve<A>((init, a) => !pipe(init, RA.elem(E)(a)))

export const match =
  <A, B>(onEmpty: Lazy<B>, onNonEmpty: (head: A, tail: IOGenerator<A>) => B) =>
  (ma: IOGenerator<A>): B =>
    pipe(ma().next(), (a) =>
      a.done ? onEmpty() : onNonEmpty(a.value, pipe(ma, drop(1))),
    )

export const toReadonlyArray = Fo.toReadonlyArray(Foldable)

export const isEmpty = match(constTrue, constFalse)

export const isNonEmpty = not(isEmpty)

export const lookup =
  <A>(i: number) =>
  (ma: IOGenerator<A>): O.Option<A> =>
    i < 0
      ? O.none
      : pipe(
          ma,
          drop(i),
          match(
            () => O.none,
            (a) => O.some(a),
          ),
        )

export const head = <A>(ma: IOGenerator<A>): O.Option<A> => pipe(ma, lookup(0))

export function find<A, B extends A>(
  refinement: Refinement<A, B>,
): (ma: IOGenerator<A>) => O.Option<B>
export function find<A>(
  predicate: Predicate<A>,
): (ma: IOGenerator<A>) => O.Option<A>
export function find<A>(predicate: Predicate<A>) {
  return (ma: IOGenerator<A>) => {
    for (const a of ma()) {
      if (predicate(a)) {
        return O.some(a)
      }
    }

    return O.none
  }
}

export const elem =
  <A>(Eq: Eq.Eq<A>) =>
  (a: A) =>
    find((_a: A) => Eq.equals(a, _a))
