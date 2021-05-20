import * as Appli from 'fp-ts/Applicative'
import * as _Apply from 'fp-ts/Apply'
import * as Ch from 'fp-ts/Chain'
import * as Co from 'fp-ts/Compactable'
import * as Ei from 'fp-ts/Either'
import * as Eq from 'fp-ts/Eq'
import * as Fi from 'fp-ts/Filterable'
import * as FiWI from 'fp-ts/FilterableWithIndex'
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
import * as IO from 'fp-ts/IO'
import * as Mona from 'fp-ts/Monad'
import * as MIO from 'fp-ts/MonadIO'
import * as Mono from 'fp-ts/Monoid'
import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Pointed'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/Separated'
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
    pipe(
      IO.Do,
      IO.apS('_x', x),
      IO.apS('_y', y),
      IO.map(function* ({ _x, _y }) {
        yield* _x
        yield* _y
      }),
    ),
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

export const FunctorWithIndex: FuWI.FunctorWithIndex1<URI, number> = {
  ...Functor,
  mapWithIndex: (fa, f) =>
    Functor.map(pipe(range(0), zip(fa)), ([i, a]) => f(i, a)),
}

export const Pointed: P.Pointed1<URI> = {
  URI,
  of: (a) =>
    function* () {
      yield a
    },
}

export const of = Pointed.of
export const Do = Pointed.of({})

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

export const Compactable: Co.Compactable1<URI> = {
  URI,
  compact: (fa) => Functor.map(Filterable.filter(fa, O.isSome), (a) => a.value),
  separate: (fa) =>
    S.separated(
      Functor.map(_filter(fa, Ei.isLeft), (a) => a.left),
      Functor.map(_filter(fa, Ei.isRight), (a) => a.right),
    ),
}

export const compact = Compactable.compact
export const separate = Compactable.separate

function _partition<A, B extends A>(
  fa: IOGenerator<A>,
  refinement: Refinement<A, B>,
): S.Separated<IOGenerator<A>, IOGenerator<B>>
function _partition<A>(
  fa: IOGenerator<A>,
  predicate: Predicate<A>,
): S.Separated<IOGenerator<A>, IOGenerator<A>>
function _partition<A>(fa: IOGenerator<A>, predicate: Predicate<A>) {
  return S.separated(_filter(fa, not(predicate)), _filter(fa, predicate))
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

export const sieve =
  <A>(f: (init: ReadonlyArray<A>, a: A) => boolean) =>
  (as: IOGenerator<A>): IOGenerator<A> =>
    function* () {
      const init: Array<A> = []
      for (const a of as()) {
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

export const flatten = <A>(as: IOGenerator<IOGenerator<A>>): IOGenerator<A> =>
  function* () {
    for (const a of as()) {
      yield* a()
    }
  }

export const take =
  <A>(n: number) =>
  (as: IOGenerator<A>): IOGenerator<A> =>
    function* () {
      for (const [i, a] of pipe(range(0), zip(as))()) {
        if (i >= n) {
          break
        }

        yield a
      }
    }

export const drop =
  <A>(n: number) =>
  (as: IOGenerator<A>): IOGenerator<A> =>
    function* () {
      for (const [i, a] of pipe(range(0), zip(as))()) {
        if (i < n) {
          continue
        }

        yield a
      }
    }

export const zip =
  <A, B>(bs: IOGenerator<B>) =>
  (as: IOGenerator<A>): IOGenerator<Readonly<[A, B]>> =>
    function* () {
      const _bs = bs()
      for (const a of as()) {
        const b = _bs.next()
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
  (as: IOGenerator<A>): B =>
    pipe(as().next(), (a) =>
      a.done ? onEmpty() : onNonEmpty(a.value, pipe(as, drop(1))),
    )

export const toReadonlyArray = <A>(as: IOGenerator<A>): ReadonlyArray<A> => {
  const _as: Array<A> = []
  for (const a of as()) {
    _as.push(a)
  }

  return _as
}

export const isEmpty = match(constTrue, constFalse)

export const isNonEmpty = not(isEmpty)

export const lookup =
  <A>(i: number) =>
  (as: IOGenerator<A>): O.Option<A> =>
    i < 0
      ? O.none
      : pipe(
          as,
          drop(i),
          match(
            () => O.none,
            (a) => O.some(a),
          ),
        )

export const head = <A>(as: IOGenerator<A>): O.Option<A> => pipe(as, lookup(0))

export function find<A, B extends A>(
  refinement: Refinement<A, B>,
): (as: IOGenerator<A>) => O.Option<B>
export function find<A>(
  predicate: Predicate<A>,
): (as: IOGenerator<A>) => O.Option<A>
export function find<A>(predicate: Predicate<A>) {
  return (as: IOGenerator<A>) => {
    for (const a of as()) {
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
