import {
  apply,
  chain as _chain,
  either,
  eq,
  fromIO as _fromIO,
  functor,
  option,
  ord,
  predicate as _predicate,
  random as _random,
  readonlyArray,
  readonlyRecord,
  separated,
} from 'fp-ts'
import { Alt1 } from 'fp-ts/Alt'
import { Alternative1 } from 'fp-ts/Alternative'
import {
  Applicative as _Applicative,
  Applicative1,
  Applicative2,
  Applicative2C,
  Applicative3,
  Applicative3C,
  Applicative4,
} from 'fp-ts/Applicative'
import { Apply1 } from 'fp-ts/Apply'
import { Chain1 } from 'fp-ts/Chain'
import { Compactable1 } from 'fp-ts/Compactable'
import { Either } from 'fp-ts/Either'
import { Eq } from 'fp-ts/Eq'
import { Extend1 } from 'fp-ts/Extend'
import { Filterable1 } from 'fp-ts/Filterable'
import { FilterableWithIndex1 } from 'fp-ts/FilterableWithIndex'
import { Foldable1 } from 'fp-ts/Foldable'
import { FoldableWithIndex1 } from 'fp-ts/FoldableWithIndex'
import { FromIO1 } from 'fp-ts/FromIO'
import {
  constFalse,
  constTrue,
  flip,
  flow,
  identity,
  Lazy,
  pipe,
} from 'fp-ts/function'
import { Functor1 } from 'fp-ts/Functor'
import { FunctorWithIndex1 } from 'fp-ts/FunctorWithIndex'
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
import { IO } from 'fp-ts/IO'
import { Monad1 } from 'fp-ts/Monad'
import { MonadIO1 } from 'fp-ts/MonadIO'
import { Monoid } from 'fp-ts/Monoid'
import { Option } from 'fp-ts/Option'
import { Ord } from 'fp-ts/Ord'
import { Pointed1 } from 'fp-ts/Pointed'
import { Predicate } from 'fp-ts/Predicate'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'
import { Refinement } from 'fp-ts/Refinement'
import { Separated } from 'fp-ts/Separated'
import { Traversable1 } from 'fp-ts/Traversable'
import { TraversableWithIndex1 } from 'fp-ts/TraversableWithIndex'
import { Unfoldable1 } from 'fp-ts/Unfoldable'
import { Witherable1 } from 'fp-ts/Witherable'
import * as t from 'io-ts'
import { curry } from './function'

export const URI = 'Yield'

export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    [URI]: Yield<A>
  }
}

export type Yield<A> = Lazy<Generator<A>>

export const getMonoid = <A>(): Monoid<Yield<A>> => ({
  empty: fromReadonlyArray([]),
  concat: (x, y) =>
    function* () {
      yield* x()
      yield* y()
    },
})

export const getEq = <A>(E: Eq<A>): Eq<Yield<A>> =>
  eq.fromEquals((x, y) => {
    const bs = y()
    for (const a of x()) {
      const b = bs.next()
      if (b.done || !E.equals(a, b.value)) {
        return false
      }
    }

    return Boolean(bs.next().done)
  })

export const getOrd = <A>(O: Ord<A>): Ord<Yield<A>> =>
  ord.fromCompare((first, second) => {
    const bs = second()
    for (const a of first()) {
      const b = bs.next()
      if (b.done) {
        return 1
      }

      const ordering = O.compare(a, b.value)
      if (0 !== ordering) {
        return ordering
      }
    }

    return !bs.next().done ? -1 : 0
  })

export const Functor: Functor1<URI> = {
  URI,
  map: (fa, f) =>
    function* () {
      for (const a of fa()) {
        yield f(a)
      }
    },
}

export const map = curry(flip(Functor.map))
export const flap = functor.flap(Functor)
export const bindTo = functor.bindTo(Functor)

export const Pointed: Pointed1<URI> = {
  URI,
  of: (a) =>
    function* () {
      yield a
    },
}

export const of = Pointed.of
export const Do = Pointed.of({})

export const FunctorWithIndex: FunctorWithIndex1<URI, number> = {
  ...Functor,
  mapWithIndex: (fa, f) =>
    Functor.map(pipe(fa, zip(range(0))), ([a, i]) => f(i, a)),
}

export const mapWithIndex = curry(flip(FunctorWithIndex.mapWithIndex))

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
  chain: (fa, f) => flatten(Functor.map(fa, f)),
}

export const chain = curry(flip(Chain.chain))
export const chainFirst = _chain.chainFirst(Chain)
export const bind = _chain.bind(Chain)

export const chainWithIndex =
  <A, B>(f: (i: number, a: A) => Yield<B>) =>
  (fa: Yield<A>): Yield<B> =>
    pipe(
      fa,
      zip(range(0)),
      chain(([a, i]) => f(i, a)),
    )

export const Monad: Monad1<URI> = { ...Applicative, ...Chain }

export const FromIO: FromIO1<URI> = {
  URI,
  fromIO: (fa) => pipe(range(0), map(fa)),
}

export const fromIO = FromIO.fromIO
export const fromIOK = _fromIO.fromIOK(FromIO)
export const chainIOK = _fromIO.chainIOK(FromIO, Chain)
export const chainFirstIOK = _fromIO.chainFirstIOK(FromIO, Chain)

export const MonadIO: MonadIO1<URI> = { ...Monad, ...FromIO }

export const Unfoldable: Unfoldable1<URI> = {
  URI,
  unfold: (b, f) =>
    function* () {
      for (
        let _b = b, ab = f(_b);
        option.isSome(ab);
        _b = ab.value[1], ab = f(_b)
      ) {
        yield ab.value[0]
      }
    },
}

export const unfold = curry(flip(Unfoldable.unfold))

export const Alt: Alt1<URI> = {
  ...Functor,
  alt: <A>(fa: Yield<A>, that: Lazy<Yield<A>>) =>
    getMonoid<A>().concat(fa, that()),
}

export const alt = curry(flip(Alt.alt))

export const Alternative: Alternative1<URI> = {
  ...Applicative,
  ...Alt,
  zero: <A>() => getMonoid<A>().empty,
}

export const zero = Alternative.zero

export const Extend: Extend1<URI> = {
  ...Functor,
  extend: (wa, f) =>
    pipe(
      wa,
      mapWithIndex((i) => pipe(wa, dropLeft(i), f)),
    ),
}

export const extend = curry(flip(Extend.extend))
export const duplicate = <A>(fa: Yield<A>) => pipe(fa, extend(identity))

export const Compactable: Compactable1<URI> = {
  URI,
  compact: (fa) =>
    Functor.map(Filterable.filter(fa, option.isSome), (a) => a.value),
  separate: (fa) =>
    separated.separated(
      Functor.map(Filterable.filter(fa, either.isLeft), (a) => a.left),
      Functor.map(Filterable.filter(fa, either.isRight), (a) => a.right),
    ),
}

export const compact = Compactable.compact
export const separate = Compactable.separate

function _filter<A, B extends A>(
  fa: Yield<A>,
  refinement: Refinement<A, B>,
): Yield<B>
function _filter<A>(fa: Yield<A>, predicate: Predicate<A>): Yield<A>
function _filter<A>(fa: Yield<A>, predicate: Predicate<A>) {
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
  fa: Yield<A>,
  refinement: Refinement<A, B>,
): Separated<Yield<A>, Yield<B>>
function _partition<A>(
  fa: Yield<A>,
  predicate: Predicate<A>,
): Separated<Yield<A>, Yield<A>>
function _partition<A>(fa: Yield<A>, predicate: Predicate<A>) {
  return separated.separated(
    Filterable.filter(fa, _predicate.not(predicate)),
    Filterable.filter(fa, predicate),
  )
}

export const Filterable: Filterable1<URI> = {
  ...Functor,
  ...Compactable,
  filter: _filter,
  filterMap: (fa, f) => Compactable.compact(Functor.map(fa, f)),
  partition: _partition,
  partitionMap: (fa, f) => Compactable.separate(Functor.map(fa, f)),
}

export function filter<A, B extends A>(
  refinement: Refinement<A, B>,
): (fa: Yield<A>) => Yield<B>
export function filter<A>(predicate: Predicate<A>): (fa: Yield<A>) => Yield<A>
export function filter<A>(predicate: Predicate<A>) {
  return (fa: Yield<A>) => Filterable.filter(fa, predicate)
}
export const filterMap = curry(flip(Filterable.filterMap))
export function partition<A, B extends A>(
  refinement: Refinement<A, B>,
): (fa: Yield<A>) => Separated<Yield<A>, Yield<B>>
export function partition<A>(
  predicate: Predicate<A>,
): (fa: Yield<A>) => Separated<Yield<A>, Yield<A>>
export function partition<A>(predicate: Predicate<A>) {
  return (fa: Yield<A>) => Filterable.partition(fa, predicate)
}
export const partitionMap = curry(flip(Filterable.partitionMap))

function _filterWithIndex<A, B extends A>(
  fa: Yield<A>,
  refinementWithIndex: (i: number, a: A) => a is B,
): Yield<B>
function _filterWithIndex<A>(
  fa: Yield<A>,
  predicateWithIndex: (i: number, a: A) => boolean,
): Yield<A>
function _filterWithIndex<A>(
  fa: Yield<A>,
  predicateWithIndex: (i: number, a: A) => boolean,
) {
  return Compactable.compact(
    FunctorWithIndex.mapWithIndex(fa, (i, a) =>
      predicateWithIndex(i, a) ? option.some(a) : option.none,
    ),
  )
}

function _partitionWithIndex<A, B extends A>(
  fa: Yield<A>,
  refinementWithIndex: (i: number, a: A) => a is B,
): Separated<Yield<A>, Yield<B>>
function _partitionWithIndex<A>(
  fa: Yield<A>,
  predicateWithIndex: (i: number, a: A) => boolean,
): Separated<Yield<A>, Yield<A>>
function _partitionWithIndex<A>(
  fa: Yield<A>,
  predicateWithIndex: (i: number, a: A) => boolean,
) {
  return Compactable.separate(
    FunctorWithIndex.mapWithIndex(fa, (i, a) =>
      predicateWithIndex(i, a) ? either.right(a) : either.left(a),
    ),
  )
}

export const FilterableWithIndex: FilterableWithIndex1<URI, number> = {
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
): (fa: Yield<A>) => Yield<B>
export function filterWithIndex<A>(
  predicateWithIndex: (i: number, a: A) => boolean,
): (fa: Yield<A>) => Yield<A>
export function filterWithIndex<A>(
  predicateWithIndex: (i: number, a: A) => boolean,
) {
  return (fa: Yield<A>) =>
    FilterableWithIndex.filterWithIndex(fa, predicateWithIndex)
}
export const filterMapWithIndex = curry(
  flip(FilterableWithIndex.filterMapWithIndex),
)
export function partitionWithIndex<A, B extends A>(
  refinementWithIndex: (i: number, a: A) => a is B,
): (fa: Yield<A>) => Separated<Yield<A>, Yield<B>>
export function partitionWithIndex<A>(
  predicateWithIndex: (i: number, a: A) => boolean,
): (fa: Yield<A>) => Separated<Yield<A>, Yield<A>>
export function partitionWithIndex<A>(
  predicateWithIndex: (i: number, a: A) => boolean,
) {
  return (fa: Yield<A>) =>
    FilterableWithIndex.partitionWithIndex(fa, predicateWithIndex)
}
export const partitionMapWithIndex = curry(
  flip(FilterableWithIndex.partitionMapWithIndex),
)

export const Foldable: Foldable1<URI> = {
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
  (fa: Yield<A>) =>
    Foldable.reduce(fa, b, f)
export const foldMap =
  <M>(M: Monoid<M>) =>
  <A>(f: (a: A) => M) =>
  (fa: Yield<A>) =>
    Foldable.foldMap(M)(fa, f)
export const reduceRight =
  <A, B>(b: B, f: (a: A, b: B) => B) =>
  (fa: Yield<A>) =>
    Foldable.reduceRight(fa, b, f)

export const FoldableWithIndex: FoldableWithIndex1<URI, number> = {
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
    pipe(fa, toReadonlyArray, readonlyArray.reduceRightWithIndex(b, f)),
}

export const reduceWithIndex =
  <A, B>(b: B, f: (i: number, b: B, a: A) => B) =>
  (fa: Yield<A>) =>
    FoldableWithIndex.reduceWithIndex(fa, b, f)
export const foldMapWithIndex =
  <M>(M: Monoid<M>) =>
  <A>(f: (i: number, a: A) => M) =>
  (fa: Yield<A>) =>
    FoldableWithIndex.foldMapWithIndex(M)(fa, f)
export const reduceRightWithIndex =
  <A, B>(b: B, f: (i: number, a: A, b: B) => B) =>
  (fa: Yield<A>) =>
    FoldableWithIndex.reduceRightWithIndex(fa, b, f)

function _traverse<F extends URIS4>(
  F: Applicative4<F>,
): <A, S, R, E, B>(
  ta: Yield<A>,
  f: (a: A) => Kind4<F, S, R, E, B>,
) => Kind4<F, S, R, E, Yield<B>>
function _traverse<F extends URIS3>(
  F: Applicative3<F>,
): <A, R, E, B>(
  ta: Yield<A>,
  f: (a: A) => Kind3<F, R, E, B>,
) => Kind3<F, R, E, Yield<B>>
function _traverse<F extends URIS3, E>(
  F: Applicative3C<F, E>,
): <A, R, B>(
  ta: Yield<A>,
  f: (a: A) => Kind3<F, R, E, B>,
) => Kind3<F, R, E, Yield<B>>
function _traverse<F extends URIS2>(
  F: Applicative2<F>,
): <A, E, B>(ta: Yield<A>, f: (a: A) => Kind2<F, E, B>) => Kind2<F, E, Yield<B>>
function _traverse<F extends URIS2, E>(
  F: Applicative2C<F, E>,
): <A, B>(ta: Yield<A>, f: (a: A) => Kind2<F, E, B>) => Kind2<F, E, Yield<B>>
function _traverse<F extends URIS>(
  F: Applicative1<F>,
): <A, B>(ta: Yield<A>, f: (a: A) => Kind<F, B>) => Kind<F, Yield<B>>
function _traverse<F>(F: _Applicative<F>) {
  return <A, B>(ta: Yield<A>, f: (a: A) => HKT<F, B>) =>
    TraversableWithIndex.traverseWithIndex(F)(ta, (_: number, a: A) => f(a))
}

export function sequence<F extends URIS4>(
  F: Applicative4<F>,
): <S, R, E, A>(ta: Yield<Kind4<F, S, R, E, A>>) => Kind4<F, S, R, E, Yield<A>>
export function sequence<F extends URIS3>(
  F: Applicative3<F>,
): <R, E, A>(ta: Yield<Kind3<F, R, E, A>>) => Kind3<F, R, E, Yield<A>>
export function sequence<F extends URIS3, E>(
  F: Applicative3C<F, E>,
): <R, A>(ta: Yield<Kind3<F, R, E, A>>) => Kind3<F, R, E, Yield<A>>
export function sequence<F extends URIS2>(
  F: Applicative2<F>,
): <E, A>(ta: Yield<Kind2<F, E, A>>) => Kind2<F, E, Yield<A>>
export function sequence<F extends URIS2, E>(
  F: Applicative2C<F, E>,
): <A>(ta: Yield<Kind2<F, E, A>>) => Kind2<F, E, Yield<A>>
export function sequence<F extends URIS>(
  F: Applicative1<F>,
): <A>(ta: Yield<Kind<F, A>>) => Kind<F, Yield<A>>
export function sequence<F>(
  F: _Applicative<F>,
): <A>(ta: Yield<HKT<F, A>>) => HKT<F, Yield<A>> {
  return <A>(ta: Yield<HKT<F, A>>) => Traversable.traverse(F)(ta, identity)
}

export const Traversable: Traversable1<URI> = {
  ...Functor,
  ...Foldable,
  traverse: _traverse,
  sequence,
}

export function traverse<F extends URIS4>(
  F: Applicative4<F>,
): <A, S, R, E, B>(
  f: (a: A) => Kind4<F, S, R, E, B>,
) => (ta: Yield<A>) => Kind4<F, S, R, E, Yield<B>>
export function traverse<F extends URIS3>(
  F: Applicative3<F>,
): <A, R, E, B>(
  f: (a: A) => Kind3<F, R, E, B>,
) => (ta: Yield<A>) => Kind3<F, R, E, Yield<B>>
export function traverse<F extends URIS3, E>(
  F: Applicative3C<F, E>,
): <A, R, B>(
  f: (a: A) => Kind3<F, R, E, B>,
) => (ta: Yield<A>) => Kind3<F, R, E, Yield<B>>
export function traverse<F extends URIS2>(
  F: Applicative2<F>,
): <A, E, B>(
  f: (a: A) => Kind2<F, E, B>,
) => (ta: Yield<A>) => Kind2<F, E, Yield<B>>
export function traverse<F extends URIS2, E>(
  F: Applicative2C<F, E>,
): <A, B>(
  f: (a: A) => Kind2<F, E, B>,
) => (ta: Yield<A>) => Kind2<F, E, Yield<B>>
export function traverse<F extends URIS>(
  F: Applicative1<F>,
): <A, B>(f: (a: A) => Kind<F, B>) => (ta: Yield<A>) => Kind<F, Yield<B>>
export function traverse<F>(F: _Applicative<F>) {
  return <A, B>(f: (a: A) => HKT<F, B>) =>
    (ta: Yield<A>) =>
      Traversable.traverse(F)(ta, f)
}

function _traverseWithIndex<F extends URIS4>(
  F: Applicative4<F>,
): <A, S, R, E, B>(
  ta: Yield<A>,
  f: (i: number, a: A) => Kind4<F, S, R, E, B>,
) => Kind4<F, S, R, E, Yield<B>>
function _traverseWithIndex<F extends URIS3>(
  F: Applicative3<F>,
): <A, R, E, B>(
  ta: Yield<A>,
  f: (i: number, a: A) => Kind3<F, R, E, B>,
) => Kind3<F, R, E, Yield<B>>
function _traverseWithIndex<F extends URIS3, E>(
  F: Applicative3C<F, E>,
): <A, R, B>(
  ta: Yield<A>,
  f: (i: number, a: A) => Kind3<F, R, E, B>,
) => Kind3<F, R, E, Yield<B>>
function _traverseWithIndex<F extends URIS2>(
  F: Applicative2<F>,
): <A, E, B>(
  ta: Yield<A>,
  f: (i: number, a: A) => Kind2<F, E, B>,
) => Kind2<F, E, Yield<B>>
function _traverseWithIndex<F extends URIS2, E>(
  F: Applicative2C<F, E>,
): <A, B>(
  ta: Yield<A>,
  f: (i: number, a: A) => Kind2<F, E, B>,
) => Kind2<F, E, Yield<B>>
function _traverseWithIndex<F extends URIS>(
  F: Applicative1<F>,
): <A, B>(ta: Yield<A>, f: (i: number, a: A) => Kind<F, B>) => Kind<F, Yield<B>>
function _traverseWithIndex<F>(F: _Applicative<F>) {
  return <A, B>(ta: Yield<A>, f: (i: number, a: A) => HKT<F, B>) =>
    FoldableWithIndex.reduceWithIndex(ta, F.of(zero<B>()), (i, fbs, a) =>
      F.ap(
        F.map(fbs, (bs) => (b: B) => pipe(bs, append(b))),
        f(i, a),
      ),
    )
}

export const TraversableWithIndex: TraversableWithIndex1<URI, number> = {
  ...FunctorWithIndex,
  ...FoldableWithIndex,
  ...Traversable,
  traverseWithIndex: _traverseWithIndex,
}

export function traverseWithIndex<F extends URIS4>(
  F: Applicative4<F>,
): <A, S, R, E, B>(
  f: (i: number, a: A) => Kind4<F, S, R, E, B>,
) => (ta: Yield<A>) => Kind4<F, S, R, E, Yield<B>>
export function traverseWithIndex<F extends URIS3>(
  F: Applicative3<F>,
): <A, R, E, B>(
  f: (i: number, a: A) => Kind3<F, R, E, B>,
) => (ta: Yield<A>) => Kind3<F, R, E, Yield<B>>
export function traverseWithIndex<F extends URIS3, E>(
  F: Applicative3C<F, E>,
): <A, R, B>(
  f: (i: number, a: A) => Kind3<F, R, E, B>,
) => (ta: Yield<A>) => Kind3<F, R, E, Yield<B>>
export function traverseWithIndex<F extends URIS2>(
  F: Applicative2<F>,
): <A, E, B>(
  f: (i: number, a: A) => Kind2<F, E, B>,
) => (ta: Yield<A>) => Kind2<F, E, Yield<B>>
export function traverseWithIndex<F extends URIS2, E>(
  F: Applicative2C<F, E>,
): <A, B>(
  f: (i: number, a: A) => Kind2<F, E, B>,
) => (ta: Yield<A>) => Kind2<F, E, Yield<B>>
export function traverseWithIndex<F extends URIS>(
  F: Applicative1<F>,
): <A, B>(
  f: (i: number, a: A) => Kind<F, B>,
) => (ta: Yield<A>) => Kind<F, Yield<B>>
export function traverseWithIndex<F>(F: _Applicative<F>) {
  return <A, B>(f: (i: number, a: A) => HKT<F, B>) =>
    (ta: Yield<A>) =>
      TraversableWithIndex.traverseWithIndex(F)(ta, f)
}

function _wilt<F extends URIS3>(
  F: Applicative3<F>,
): <A, R, E, B, C>(
  wa: Yield<A>,
  f: (a: A) => Kind3<F, R, E, Either<B, C>>,
) => Kind3<F, R, E, Separated<Yield<B>, Yield<C>>>
function _wilt<F extends URIS3, E>(
  F: Applicative3C<F, E>,
): <A, R, B, C>(
  wa: Yield<A>,
  f: (a: A) => Kind3<F, R, E, Either<B, C>>,
) => Kind3<F, R, E, Separated<Yield<B>, Yield<C>>>
function _wilt<F extends URIS2>(
  F: Applicative2<F>,
): <A, E, B, C>(
  wa: Yield<A>,
  f: (a: A) => Kind2<F, E, Either<B, C>>,
) => Kind2<F, E, Separated<Yield<B>, Yield<C>>>
function _wilt<F extends URIS2, E>(
  F: Applicative2C<F, E>,
): <A, B, C>(
  wa: Yield<A>,
  f: (a: A) => Kind2<F, E, Either<B, C>>,
) => Kind2<F, E, Separated<Yield<B>, Yield<C>>>
function _wilt<F extends URIS>(
  F: Applicative1<F>,
): <A, B, C>(
  wa: Yield<A>,
  f: (a: A) => Kind<F, Either<B, C>>,
) => Kind<F, Separated<Yield<B>, Yield<C>>>
function _wilt<F>(F: _Applicative<F>) {
  return <A, B, C>(wa: Yield<A>, f: (a: A) => HKT<F, Either<B, C>>) =>
    F.map(Traversable.traverse(F)(wa, f), separate)
}

function _wither<F extends URIS3>(
  F: Applicative3<F>,
): <A, R, E, B>(
  ta: Yield<A>,
  f: (a: A) => Kind3<F, R, E, Option<B>>,
) => Kind3<F, R, E, Yield<B>>
function _wither<F extends URIS3, E>(
  F: Applicative3C<F, E>,
): <A, R, B>(
  ta: Yield<A>,
  f: (a: A) => Kind3<F, R, E, Option<B>>,
) => Kind3<F, R, E, Yield<B>>
function _wither<F extends URIS2>(
  F: Applicative2<F>,
): <A, E, B>(
  ta: Yield<A>,
  f: (a: A) => Kind2<F, E, Option<B>>,
) => Kind2<F, E, Yield<B>>
function _wither<F extends URIS2, E>(
  F: Applicative2C<F, E>,
): <A, B>(
  ta: Yield<A>,
  f: (a: A) => Kind2<F, E, Option<B>>,
) => Kind2<F, E, Yield<B>>
function _wither<F extends URIS>(
  F: Applicative1<F>,
): <A, B>(ta: Yield<A>, f: (a: A) => Kind<F, Option<B>>) => Kind<F, Yield<B>>
function _wither<F>(F: _Applicative<F>) {
  return <A, B>(ta: Yield<A>, f: (a: A) => HKT<F, Option<B>>) =>
    F.map(Traversable.traverse(F)(ta, f), compact)
}

export const Witherable: Witherable1<URI> = {
  ...Traversable,
  ...Filterable,
  wilt: _wilt,
  wither: _wither,
}

export function wilt<F extends URIS3>(
  F: Applicative3<F>,
): <A, R, E, B, C>(
  f: (a: A) => Kind3<F, R, E, Either<B, C>>,
) => (wa: Yield<A>) => Kind3<F, R, E, Separated<Yield<B>, Yield<C>>>
export function wilt<F extends URIS3, E>(
  F: Applicative3C<F, E>,
): <A, R, B, C>(
  f: (a: A) => Kind3<F, R, E, Either<B, C>>,
) => (wa: Yield<A>) => Kind3<F, R, E, Separated<Yield<B>, Yield<C>>>
export function wilt<F extends URIS2>(
  F: Applicative2<F>,
): <A, E, B, C>(
  f: (a: A) => Kind2<F, E, Either<B, C>>,
) => (wa: Yield<A>) => Kind2<F, E, Separated<Yield<B>, Yield<C>>>
export function wilt<F extends URIS2, E>(
  F: Applicative2C<F, E>,
): <A, B, C>(
  f: (a: A) => Kind2<F, E, Either<B, C>>,
) => (wa: Yield<A>) => Kind2<F, E, Separated<Yield<B>, Yield<C>>>
export function wilt<F extends URIS>(
  F: Applicative1<F>,
): <A, B, C>(
  f: (a: A) => Kind<F, Either<B, C>>,
) => (wa: Yield<A>) => Kind<F, Separated<Yield<B>, Yield<C>>>
export function wilt<F>(F: _Applicative<F>) {
  return <A, B, C>(f: (a: A) => HKT<F, Either<B, C>>) =>
    (wa: Yield<A>) =>
      Witherable.wilt(F)(wa, f)
}
export function wither<F extends URIS3>(
  F: Applicative3<F>,
): <A, R, E, B>(
  f: (a: A) => Kind3<F, R, E, Option<B>>,
) => (ta: Yield<A>) => Kind3<F, R, E, Yield<B>>
export function wither<F extends URIS3, E>(
  F: Applicative3C<F, E>,
): <A, R, B>(
  f: (a: A) => Kind3<F, R, E, Option<B>>,
) => (ta: Yield<A>) => Kind3<F, R, E, Yield<B>>
export function wither<F extends URIS2>(
  F: Applicative2<F>,
): <A, E, B>(
  f: (a: A) => Kind2<F, E, Option<B>>,
) => (ta: Yield<A>) => Kind2<F, E, Yield<B>>
export function wither<F extends URIS2, E>(
  F: Applicative2C<F, E>,
): <A, B>(
  f: (a: A) => Kind2<F, E, Option<B>>,
) => (ta: Yield<A>) => Kind2<F, E, Yield<B>>
export function wither<F extends URIS>(
  F: Applicative1<F>,
): <A, B>(
  f: (a: A) => Kind<F, Option<B>>,
) => (ta: Yield<A>) => Kind<F, Yield<B>>
export function wither<F>(F: _Applicative<F>) {
  return <A, B>(f: (a: A) => HKT<F, Option<B>>) =>
    (ta: Yield<A>) =>
      Witherable.wither(F)(ta, f)
}

export const makeBy = <A>(f: (i: number) => A): Yield<A> =>
  function* () {
    for (let i = 0; true; i++) {
      yield f(i)
    }
  }

export const range = (start: number, end = Infinity): Yield<number> =>
  pipe(
    makeBy((i) => start + i),
    takeLeftWhile((n) => n <= Math.max(start, end)),
  )

export const replicate = <A>(a: A): Yield<A> => makeBy(() => a)

export const fromReadonlyArray = <A>(as: ReadonlyArray<A>): Yield<A> =>
  function* () {
    yield* as
  }

export const fromReadonlyRecord = readonlyRecord.toUnfoldable(Unfoldable)

export const random: Yield<number> = fromIO(_random.random)

export const randomInt = (low: number, high: number): Yield<t.Int> =>
  fromIO(
    _random.randomInt(
      Math.floor(low),
      Math.max(Math.floor(low), Math.floor(high)),
    ) as IO<t.Int>,
  )

export const randomRange = (min: number, max: number): Yield<number> =>
  fromIO(_random.randomRange(min, Math.max(min, max)))

export const randomBool: Yield<boolean> = fromIO(_random.randomBool)

export const randomElem = <A>(as: ReadonlyNonEmptyArray<A>): Yield<A> =>
  fromIO(_random.randomElem(as))

export const prime: Yield<number> = pipe(
  range(2),
  sieve((init, n) =>
    pipe(
      init,
      readonlyArray.every((_n) => 0 !== n % _n),
    ),
  ),
)

export const exp: Yield<number> = makeBy((n) => Math.exp(n))

export const fibonacci: Yield<number> = function* () {
  for (let ns = [1, 0] as [number, number]; true; ns = [ns[1], ns[0] + ns[1]]) {
    yield ns[1]
  }
}

export const flatten = <A>(mma: Yield<Yield<A>>): Yield<A> =>
  function* () {
    for (const ma of mma()) {
      yield* ma()
    }
  }

export const prepend =
  <A>(a: A) =>
  (ma: Yield<A>): Yield<A> =>
    function* () {
      yield a
      yield* ma()
    }

export const append =
  <A>(a: A) =>
  (ma: Yield<A>): Yield<A> =>
    function* () {
      yield* ma()
      yield a
    }

export const takeLeft =
  (n: number) =>
  <A>(ma: Yield<A>): Yield<A> =>
    function* () {
      for (const [a, i] of pipe(ma, zip(range(0)))()) {
        if (i >= n) {
          break
        }

        yield a
      }
    }

export const takeRight =
  (n: number) =>
  <A>(ma: Yield<A>): Yield<A> =>
    pipe(ma, toReadonlyArray, readonlyArray.takeRight(n), fromReadonlyArray)

export function takeLeftWhile<A, B extends A>(
  refinement: Refinement<A, B>,
): (ma: Yield<A>) => Yield<B>
export function takeLeftWhile<A>(
  predicate: Predicate<A>,
): (ma: Yield<A>) => Yield<A>
export function takeLeftWhile<A>(predicate: Predicate<A>) {
  return (ma: Yield<A>) =>
    function* () {
      for (const a of ma()) {
        if (!predicate(a)) {
          break
        }

        yield a
      }
    }
}

export const dropLeft =
  (n: number) =>
  <A>(ma: Yield<A>): Yield<A> =>
    function* () {
      for (const [a, i] of pipe(ma, zip(range(0)))()) {
        if (i < n) {
          continue
        }

        yield a
      }
    }

export const dropRight =
  (n: number) =>
  <A>(ma: Yield<A>): Yield<A> =>
    pipe(ma, toReadonlyArray, readonlyArray.dropRight(n), fromReadonlyArray)

export function dropLeftWhile<A, B extends A>(
  refinement: Refinement<A, B>,
): (ma: Yield<A>) => Yield<B>
export function dropLeftWhile<A>(
  predicate: Predicate<A>,
): (ma: Yield<A>) => Yield<A>
export function dropLeftWhile<A>(predicate: Predicate<A>) {
  return (ma: Yield<A>) =>
    function* () {
      const as = ma()
      let a = as.next()
      while (!a.done && predicate(a.value)) {
        a = as.next()
      }

      if (!a.done) {
        yield a.value
      }
      yield* as
    }
}

export const scanLeft =
  <A, B>(b: B, f: (b: B, a: A) => B) =>
  (ma: Yield<A>): Yield<B> =>
    function* () {
      yield b
      let _b = b
      for (const a of ma()) {
        _b = f(_b, a)
        yield _b
      }
    }

export const scanRight =
  <A, B>(b: B, f: (a: A, b: B) => B) =>
  (ma: Yield<A>): Yield<B> =>
    pipe(
      ma,
      scanLeft(b, (b, a) => f(a, b)),
      reverse,
    )

export function sieve<A>(f: (init: ReadonlyArray<A>, a: A) => boolean) {
  return (ma: Yield<A>): Yield<A> =>
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
}

export const uniq = <A>(E: Eq<A>) =>
  sieve<A>((init, a) => !pipe(init, readonlyArray.elem(E)(a)))

export const sort = <B>(O: Ord<B>) => sortBy([O])

export const sortBy =
  <B>(Os: ReadonlyArray<Ord<B>>) =>
  <A extends B>(ma: Yield<A>): Yield<A> =>
    pipe(ma, toReadonlyArray, readonlyArray.sortBy(Os), fromReadonlyArray)

export const reverse = <A>(ma: Yield<A>): Yield<A> =>
  function* () {
    const as = toReadonlyArray(ma)
    for (let i = as.length - 1; i >= 0; i--) {
      yield as[i]
    }
  }

export const zipWith =
  <A, B, C>(mb: Yield<B>, f: (a: A, b: B) => C) =>
  (ma: Yield<A>): Yield<C> =>
    function* () {
      const bs = mb()
      for (const a of ma()) {
        const b = bs.next()
        if (b.done) {
          break
        }

        yield f(a, b.value)
      }
    }

export const zip =
  <B>(mb: Yield<B>) =>
  <A>(ma: Yield<A>): Yield<Readonly<[A, B]>> =>
    pipe(
      ma,
      zipWith(mb, (a, b) => [a, b] as const),
    )

export const rights = <E, A>(ma: Yield<Either<E, A>>): Yield<A> =>
  pipe(ma, filterMap(option.fromEither))

export const lefts = <E, A>(ma: Yield<Either<E, A>>): Yield<E> =>
  pipe(
    ma,
    filter(either.isLeft),
    map((e) => e.left),
  )

export const prependAll =
  <A>(middle: A) =>
  (ma: Yield<A>): Yield<A> =>
    pipe(
      ma,
      matchLeft(
        () => ma,
        () =>
          function* () {
            for (const a of ma()) {
              yield middle
              yield a
            }
          },
      ),
    )

export const intersperse = <A>(middle: A) =>
  flow(prependAll(middle), dropLeft(1))

export const rotate =
  (n: number) =>
  <A>(ma: Yield<A>): Yield<A> =>
    pipe(ma, toReadonlyArray, readonlyArray.rotate(n), fromReadonlyArray)

export const chop =
  <A, B>(f: (ma: Yield<A>) => Readonly<[B, Yield<A>]>) =>
  (ma: Yield<A>): Yield<B> =>
    function* () {
      for (
        let _isNonEmpty = isNonEmpty(ma), [b, _ma] = f(ma);
        _isNonEmpty;
        _isNonEmpty = isNonEmpty(_ma), [b, _ma] = f(_ma)
      ) {
        yield b
      }
    }

export const chunksOf =
  (n: number) =>
  <A>(ma: Yield<A>): Yield<Yield<A>> =>
    pipe(ma, chop(splitAt(Math.max(1, n))))

export const matchLeft =
  <A, B>(onEmpty: Lazy<B>, onNonEmpty: (head: A, tail: Yield<A>) => B) =>
  (ma: Yield<A>): B =>
    pipe(ma().next(), (a) =>
      a.done ? onEmpty() : onNonEmpty(a.value, pipe(ma, dropLeft(1))),
    )

export const matchRight =
  <A, B>(onEmpty: Lazy<B>, onNonEmpty: (init: Yield<A>, last: A) => B) =>
  (ma: Yield<A>): B =>
    pipe(
      ma,
      zip(range(0)),
      last,
      option.match(onEmpty, ([a, i]) =>
        onNonEmpty(
          pipe(
            ma,
            filterWithIndex((_i) => i !== _i),
          ),
          a,
        ),
      ),
    )

export const toReadonlyArray = <A>(ma: Yield<A>): ReadonlyArray<A> => [...ma()]

export const lookup =
  (i: number) =>
  <A>(ma: Yield<A>): Option<A> =>
    i < 0
      ? option.none
      : pipe(
          ma,
          dropLeft(i),
          matchLeft(() => option.none, option.some),
        )

export const head = lookup(0)

export const last = <A>(ma: Yield<A>): Option<A> => {
  let last: Option<A> = option.none
  for (const a of ma()) {
    last = option.some(a)
  }

  return last
}

export const tail = <A>(ma: Yield<A>): Option<Yield<A>> =>
  pipe(
    ma,
    matchLeft(
      () => option.none,
      (_, tail) => option.some(tail),
    ),
  )

export const init = <A>(ma: Yield<A>): Option<Yield<A>> =>
  pipe(
    ma,
    matchRight(() => option.none, option.some),
  )

export interface Spanned<I, R> {
  init: Yield<I>
  rest: Yield<R>
}

export function spanLeft<A, B extends A>(
  refinement: Refinement<A, B>,
): (ma: Yield<A>) => Spanned<B, A>
export function spanLeft<A>(
  predicate: Predicate<A>,
): (ma: Yield<A>) => Spanned<A, A>
export function spanLeft<A>(predicate: Predicate<A>) {
  return (ma: Yield<A>) => {
    const i = pipe(
      ma,
      findFirstIndex(_predicate.not(predicate)),
      option.getOrElse(() => Infinity),
    )
    const [init, rest] = pipe(ma, splitAt(i))

    return { init, rest }
  }
}

export const splitAt =
  (n: number) =>
  <A>(ma: Yield<A>): Readonly<[Yield<A>, Yield<A>]> =>
    [pipe(ma, takeLeft(n)), pipe(ma, dropLeft(n))]

export const unzip = <A, B>(
  mab: Yield<Readonly<[A, B]>>,
): Readonly<[Yield<A>, Yield<B>]> => [
  pipe(
    mab,
    map(([a]) => a),
  ),
  pipe(
    mab,
    map(([_, b]) => b),
  ),
]

export const isEmpty = matchLeft(constTrue, constFalse)

export const isNonEmpty = _predicate.not(isEmpty)

export const size = flow(
  mapWithIndex(identity),
  last,
  option.match(
    () => 0,
    (i) => 1 + i,
  ),
)

export const isOutOfBound =
  (n: number) =>
  (ma: Yield<unknown>): boolean =>
    n >= 0 && n < size(ma)

export function findFirst<A, B extends A>(
  refinement: Refinement<A, B>,
): (ma: Yield<A>) => Option<B>
export function findFirst<A>(
  predicate: Predicate<A>,
): (ma: Yield<A>) => Option<A>
export function findFirst<A>(predicate: Predicate<A>) {
  return (ma: Yield<A>) => {
    for (const a of ma()) {
      if (predicate(a)) {
        return option.some(a)
      }
    }

    return option.none
  }
}

export const findFirstMap =
  <A, B>(f: (a: A) => Option<B>) =>
  (ma: Yield<A>): Option<B> => {
    for (const a of ma()) {
      const b = f(a)
      if (option.isSome(b)) {
        return b
      }
    }

    return option.none
  }

export const findFirstIndex =
  <A>(predicate: Predicate<A>) =>
  (ma: Yield<A>): Option<number> =>
    pipe(
      ma,
      zip(range(0)),
      findFirst(([a]) => predicate(a)),
      option.map(([_, i]) => i),
    )

export function findLast<A, B extends A>(
  refinement: Refinement<A, B>,
): (ma: Yield<A>) => Option<B>
export function findLast<A>(
  predicate: Predicate<A>,
): (ma: Yield<A>) => Option<A>
export function findLast<A>(predicate: Predicate<A>) {
  return (ma: Yield<A>) => pipe(ma, reverse, findFirst(predicate))
}

export const findLastMap =
  <A, B>(f: (a: A) => Option<B>) =>
  (ma: Yield<A>): Option<B> =>
    pipe(ma, reverse, findFirstMap(f))

export const findLastIndex =
  <A>(predicate: Predicate<A>) =>
  (ma: Yield<A>): Option<number> =>
    pipe(
      ma,
      zip(range(0)),
      findLastMap(([a, i]) => (predicate(a) ? option.some(i) : option.none)),
    )

export const elem =
  <A>(E: Eq<A>) =>
  (a: A) =>
    findFirst((_a: A) => E.equals(a, _a))

export const insertAt =
  <A>(i: number, a: A) =>
  (ma: Yield<A>): Option<Yield<A>> =>
    pipe(
      ma,
      lookup(i),
      option.map(
        () =>
          function* () {
            for (const [_a, _i] of pipe(ma, zip(range(0)))()) {
              if (i === _i) {
                yield a
              }
              yield _a
            }
          },
      ),
    )

export const modifyAt =
  <A>(i: number, f: (a: A) => A) =>
  (ma: Yield<A>): Option<Yield<A>> =>
    pipe(
      ma,
      lookup(i),
      option.map(() =>
        pipe(
          ma,
          mapWithIndex((_i, a) => (i === _i ? f(a) : a)),
        ),
      ),
    )

export const updateAt = <A>(i: number, a: A) => modifyAt(i, () => a)

export const deleteAt =
  <A>(i: number) =>
  (ma: Yield<A>): Option<Yield<A>> =>
    pipe(
      ma,
      lookup(i),
      option.map(() =>
        pipe(
          ma,
          filterWithIndex((_i) => i !== _i),
        ),
      ),
    )
