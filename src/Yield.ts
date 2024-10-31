import * as Co from 'fp-ts/Compactable'
import * as Ei from 'fp-ts/Either'
import * as Fi from 'fp-ts/Filterable'
import * as FiWI from 'fp-ts/FilterableWithIndex'
import * as FIO from 'fp-ts/FromIO'
import { flip, Lazy, pipe } from 'fp-ts/function'
import * as Fu from 'fp-ts/Functor'
import * as FuWI from 'fp-ts/FunctorWithIndex'
import * as Op from 'fp-ts/Option'
import * as P from 'fp-ts/Pointed'
import * as Pr from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as Re from 'fp-ts/Refinement'
import * as S from 'fp-ts/Separated'
import { curry } from './function'

const URI = 'Yield'

type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    [URI]: Yield<A>
  }
}

type Yield<A> = Lazy<Generator<A>>

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

export const mapWithIndex = curry(flip(FunctorWithIndex.mapWithIndex))

export const FromIO: FIO.FromIO1<URI> = {
  URI,
  fromIO: (fa) => pipe(range(0), map(fa)),
}

export const fromIO = FromIO.fromIO

export const Compactable: Co.Compactable1<URI> = {
  URI,
  compact: (fa) =>
    Functor.map(Filterable.filter(fa, Op.isSome), (a) => a.value),
  separate: (fa) =>
    S.separated(
      Functor.map(Filterable.filter(fa, Ei.isLeft), (a) => a.left),
      Functor.map(Filterable.filter(fa, Ei.isRight), (a) => a.right),
    ),
}

function _filter<A, B extends A>(
  fa: Yield<A>,
  refinement: Re.Refinement<A, B>,
): Yield<B>
function _filter<A>(fa: Yield<A>, predicate: Pr.Predicate<A>): Yield<A>
function _filter<A>(fa: Yield<A>, predicate: Pr.Predicate<A>) {
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
  refinement: Re.Refinement<A, B>,
): S.Separated<Yield<A>, Yield<B>>
function _partition<A>(
  fa: Yield<A>,
  predicate: Pr.Predicate<A>,
): S.Separated<Yield<A>, Yield<A>>
function _partition<A>(fa: Yield<A>, predicate: Pr.Predicate<A>) {
  return S.separated(
    Filterable.filter(fa, Pr.not(predicate)),
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
      predicateWithIndex(i, a) ? Op.some(a) : Op.none,
    ),
  )
}

function _partitionWithIndex<A, B extends A>(
  fa: Yield<A>,
  refinementWithIndex: (i: number, a: A) => a is B,
): S.Separated<Yield<A>, Yield<B>>
function _partitionWithIndex<A>(
  fa: Yield<A>,
  predicateWithIndex: (i: number, a: A) => boolean,
): S.Separated<Yield<A>, Yield<A>>
function _partitionWithIndex<A>(
  fa: Yield<A>,
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

export const makeBy = <A>(f: (i: number) => A): Yield<A> =>
  function* () {
    for (let i = 0; true; i++) {
      yield f(i)
    }
  }

export function takeLeftWhile<A, B extends A>(
  refinement: Re.Refinement<A, B>,
): (ma: Yield<A>) => Yield<B>
export function takeLeftWhile<A>(
  predicate: Pr.Predicate<A>,
): (ma: Yield<A>) => Yield<A>
export function takeLeftWhile<A>(predicate: Pr.Predicate<A>) {
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

export const range = (start: number, end = Infinity): Yield<number> =>
  pipe(
    makeBy((i) => start + i),
    takeLeftWhile((n) => n <= Math.max(start, end)),
  )

export const fromReadonlyArray = <A>(as: ReadonlyArray<A>): Yield<A> =>
  function* () {
    yield* as
  }

export const flatten = <A>(mma: Yield<Yield<A>>): Yield<A> =>
  function* () {
    for (const ma of mma()) {
      yield* ma()
    }
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
    pipe(ma, toReadonlyArray, RA.takeRight(n), fromReadonlyArray)

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

export const toReadonlyArray = <A>(ma: Yield<A>): ReadonlyArray<A> => [...ma()]
