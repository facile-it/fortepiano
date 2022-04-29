import {
  apply,
  chain as _chain,
  either,
  fromIO as _fromIO,
  functor,
  option,
  predicate,
  readonlyArray,
  separated,
  task,
} from 'fp-ts'
import { Applicative1 } from 'fp-ts/Applicative'
import { Apply1 } from 'fp-ts/Apply'
import { Chain1 } from 'fp-ts/Chain'
import { Compactable1 } from 'fp-ts/Compactable'
import { Eq } from 'fp-ts/Eq'
import { Filterable1 } from 'fp-ts/Filterable'
import { FilterableWithIndex1 } from 'fp-ts/FilterableWithIndex'
import { FromIO1 } from 'fp-ts/FromIO'
import { constFalse, constTrue, flip, flow, Lazy, pipe } from 'fp-ts/function'
import { Functor1 } from 'fp-ts/Functor'
import { FunctorWithIndex1 } from 'fp-ts/FunctorWithIndex'
import { IO } from 'fp-ts/IO'
import { Monad1 } from 'fp-ts/Monad'
import { MonadIO1 } from 'fp-ts/MonadIO'
import { Monoid } from 'fp-ts/Monoid'
import { Option } from 'fp-ts/Option'
import { Pointed1 } from 'fp-ts/Pointed'
import { Predicate } from 'fp-ts/Predicate'
import { Refinement } from 'fp-ts/Refinement'
import { Separated } from 'fp-ts/Separated'
import { Task } from 'fp-ts/Task'
import { curry } from './function'
import * as $yield from './Yield'
import { Yield } from './Yield'

export const URI = 'AsyncYield'

export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    [URI]: AsyncYield<A>
  }
}

export type AsyncYield<A> = Lazy<AsyncGenerator<A>>

export const getMonoid = <A>(): Monoid<AsyncYield<A>> => ({
  empty: fromReadonlyArray([]),
  concat: (x, y) =>
    async function* () {
      yield* x()
      yield* y()
    },
})

export const fromIOGenerator = <A>(as: Yield<A>): AsyncYield<A> =>
  async function* () {
    for (const a of as()) {
      yield a
    }
  }

export const Functor: Functor1<URI> = {
  URI,
  map: (fa, f) =>
    async function* () {
      for await (const a of fa()) {
        yield f(a)
      }
    },
}

export const map = curry(flip(Functor.map))
export const flap = functor.flap(Functor)
export const bindTo = functor.bindTo(Functor)

export const FunctorWithIndex: FunctorWithIndex1<URI, number> = {
  ...Functor,
  mapWithIndex: (fa, f) =>
    Functor.map(pipe(fa, zip(range(0))), ([a, i]) => f(i, a)),
}

export const Pointed: Pointed1<URI> = {
  URI,
  of: (a) => fromIOGenerator($yield.of(a)),
}

export const of = Pointed.of
export const Do = Pointed.of({})

export const ApplyPar: Apply1<URI> = {
  ...Functor,
  ap: (fab, fa) =>
    async function* () {
      const _fab = fab()
      const _fa = fa()
      const abs = []
      const as = []
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const [ab, a] = await Promise.all([_fab.next(), _fa.next()])
        if (ab.done && a.done) {
          break
        }

        if (!ab.done) {
          abs.push(ab.value)
        }
        if (!a.done) {
          as.push(a.value)
        }
      }

      for (const ab of abs) {
        for (const a of as) {
          yield ab(a)
        }
      }
    },
}

/**
 *
 */

export const ApplySeq: Apply1<URI> = {
  ...Functor,
  ap: (fab, fa) =>
    async function* () {
      const abs = []
      for await (const ab of fab()) {
        abs.push(ab)
      }
      const as = []
      for await (const a of fa()) {
        as.push(a)
      }

      for (const ab of abs) {
        for (const a of as) {
          yield ab(a)
        }
      }
    },
}

export const ap = curry(flip(ApplyPar.ap))
export const apFirst = apply.apFirst(ApplyPar)
export const apSecond = apply.apSecond(ApplyPar)
export const apS = apply.apS(ApplyPar)

export const ApplicativePar: Applicative1<URI> = {
  ...Pointed,
  ...ApplyPar,
}

export const ApplicativeSeq: Applicative1<URI> = {
  ...Pointed,
  ...ApplySeq,
}

export const Chain: Chain1<URI> = {
  ...ApplySeq,
  chain: (fa, f) => {
    return flatten(Functor.map(fa, f))
  },
}

export const chain = curry(flip(Chain.chain))
export const chainFirst = _chain.chainFirst(Chain)
export const bind = _chain.bind(Chain)

export const Monad: Monad1<URI> = { ...ApplicativeSeq, ...Chain }

export const FromIO: FromIO1<URI> = {
  URI,
  fromIO: (fa) => () => Pointed.of(fa())(),
}

export const fromIO = FromIO.fromIO
export const fromIOK = _fromIO.fromIOK(FromIO)
export const chainIOK = _fromIO.chainIOK(FromIO, Chain)
export const chainFirstIOK = _fromIO.chainFirstIOK(FromIO, Chain)

export const fromIOReadonlyArray = <A>(
  fa: IO<ReadonlyArray<A>>,
): AsyncYield<A> => pipe(fa, fromIO, chain(fromReadonlyArray))

export const fromIOReadonlyArrayK = <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => IO<ReadonlyArray<B>>,
) => flow(f, fromIOReadonlyArray)

export const chainIOReadonlyArrayK = <A, B>(
  f: (a: A) => IO<ReadonlyArray<B>>,
) => chain(fromIOReadonlyArrayK(f))

export const MonadIO: MonadIO1<URI> = { ...Monad, ...FromIO }

function _filter<A, B extends A>(
  fa: AsyncYield<A>,
  refinement: Refinement<A, B>,
): AsyncYield<B>
function _filter<A>(fa: AsyncYield<A>, predicate: Predicate<A>): AsyncYield<A>
function _filter<A>(fa: AsyncYield<A>, predicate: Predicate<A>) {
  return async function* () {
    for await (const a of fa()) {
      if (!predicate(a)) {
        continue
      }

      yield a
    }
  }
}

export const Compactable: Compactable1<URI> = {
  URI,
  compact: (fa) =>
    Functor.map(Filterable.filter(fa, option.isSome), (a) => a.value),
  separate: (fa) =>
    separated.separated(
      Functor.map(_filter(fa, either.isLeft), (a) => a.left),
      Functor.map(_filter(fa, either.isRight), (a) => a.right),
    ),
}

export const compact = Compactable.compact
export const separate = Compactable.separate

function _partition<A, B extends A>(
  fa: AsyncYield<A>,
  refinement: Refinement<A, B>,
): Separated<AsyncYield<A>, AsyncYield<B>>
function _partition<A>(
  fa: AsyncYield<A>,
  predicate: Predicate<A>,
): Separated<AsyncYield<A>, AsyncYield<A>>
function _partition<A>(fa: AsyncYield<A>, _predicate: Predicate<A>) {
  return separated.separated(
    _filter(fa, predicate.not(_predicate)),
    _filter(fa, _predicate),
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
): (fa: AsyncYield<A>) => AsyncYield<B>
export function filter<A>(
  predicate: Predicate<A>,
): (fa: AsyncYield<A>) => AsyncYield<A>
export function filter<A>(predicate: Predicate<A>) {
  return (fa: AsyncYield<A>) => Filterable.filter(fa, predicate)
}
export const filterMap = curry(flip(Filterable.filterMap))
export function partition<A, B extends A>(
  refinement: Refinement<A, B>,
): (fa: AsyncYield<A>) => Separated<AsyncYield<A>, AsyncYield<B>>
export function partition<A>(
  predicate: Predicate<A>,
): (fa: AsyncYield<A>) => Separated<AsyncYield<A>, AsyncYield<A>>
export function partition<A>(predicate: Predicate<A>) {
  return (fa: AsyncYield<A>) => Filterable.partition(fa, predicate)
}
export const partitionMap = curry(flip(Filterable.partitionMap))

function _filterWithIndex<A, B extends A>(
  fa: AsyncYield<A>,
  refinementWithIndex: (i: number, a: A) => a is B,
): AsyncYield<B>
function _filterWithIndex<A>(
  fa: AsyncYield<A>,
  predicateWithIndex: (i: number, a: A) => boolean,
): AsyncYield<A>
function _filterWithIndex<A>(
  fa: AsyncYield<A>,
  predicateWithIndex: (i: number, a: A) => boolean,
) {
  return Compactable.compact(
    FunctorWithIndex.mapWithIndex(fa, (i, a) =>
      predicateWithIndex(i, a) ? option.some(a) : option.none,
    ),
  )
}

function _partitionWithIndex<A, B extends A>(
  fa: AsyncYield<A>,
  refinementWithIndex: (i: number, a: A) => a is B,
): Separated<AsyncYield<A>, AsyncYield<B>>
function _partitionWithIndex<A>(
  fa: AsyncYield<A>,
  predicateWithIndex: (i: number, a: A) => boolean,
): Separated<AsyncYield<A>, AsyncYield<A>>
function _partitionWithIndex<A>(
  fa: AsyncYield<A>,
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
): (fa: AsyncYield<A>) => AsyncYield<B>
export function filterWithIndex<A>(
  predicateWithIndex: (i: number, a: A) => boolean,
): (fa: AsyncYield<A>) => AsyncYield<A>
export function filterWithIndex<A>(
  predicateWithIndex: (i: number, a: A) => boolean,
) {
  return (fa: AsyncYield<A>) =>
    FilterableWithIndex.filterWithIndex(fa, predicateWithIndex)
}
export const filterMapWithIndex = curry(
  flip(FilterableWithIndex.filterMapWithIndex),
)
export function partitionWithIndex<A, B extends A>(
  refinementWithIndex: (i: number, a: A) => a is B,
): (fa: AsyncYield<A>) => Separated<AsyncYield<A>, AsyncYield<B>>
export function partitionWithIndex<A>(
  predicateWithIndex: (i: number, a: A) => boolean,
): (fa: AsyncYield<A>) => Separated<AsyncYield<A>, AsyncYield<A>>
export function partitionWithIndex<A>(
  predicateWithIndex: (i: number, a: A) => boolean,
) {
  return (fa: AsyncYield<A>) =>
    FilterableWithIndex.partitionWithIndex(fa, predicateWithIndex)
}
export const partitionMapWithIndex = curry(
  flip(FilterableWithIndex.partitionMapWithIndex),
)

export const range = flow($yield.range, fromIOGenerator)
export const replicate = flow($yield.replicate, fromIOGenerator)
export const fromReadonlyArray = <A>(x: ReadonlyArray<A>) => {
  return flow($yield.fromReadonlyArray, fromIOGenerator)(x)
}

export const sieve =
  <A>(f: (init: ReadonlyArray<A>, a: A) => boolean) =>
  (as: AsyncYield<A>): AsyncYield<A> =>
    async function* () {
      const init: Array<A> = []
      for await (const a of as()) {
        if (!f(init, a)) {
          continue
        }

        init.push(a)
        yield a
      }
    }

export const prime: AsyncYield<number> = pipe(
  range(2),
  sieve((init, a) =>
    pipe(
      init,
      readonlyArray.every((_a) => 0 !== a % _a),
    ),
  ),
)

export const exp: AsyncYield<number> = pipe(
  range(0),
  map((n) => Math.exp(n)),
)

export const fibonacci: AsyncYield<number> = async function* () {
  for (let as = [1, 0] as [number, number]; true; as = [as[1], as[0] + as[1]]) {
    yield as[1]
  }
}

export const flatten = <A>(as: AsyncYield<AsyncYield<A>>): AsyncYield<A> =>
  async function* () {
    for await (const a of as()) {
      yield* a()
    }
  }

export const take =
  <A>(n: number) =>
  (as: AsyncYield<A>): AsyncYield<A> =>
    async function* () {
      for await (const [a, i] of pipe(as, zip(range(0)))()) {
        if (i >= n) {
          break
        }

        yield a
      }
    }

export const drop =
  <A>(n: number) =>
  (as: AsyncYield<A>): AsyncYield<A> =>
    async function* () {
      for await (const [a, i] of pipe(as, zip(range(0)))()) {
        if (i < n) {
          continue
        }

        yield a
      }
    }

export const zip =
  <A, B>(bs: AsyncYield<B>) =>
  (as: AsyncYield<A>): AsyncYield<Readonly<[A, B]>> =>
    async function* () {
      const _bs = bs()
      for await (const a of as()) {
        const b = await _bs.next()
        if (b.done) {
          break
        }

        yield [a, b.value] as const
      }
    }

export const uniq = <A>(E: Eq<A>) =>
  sieve<A>((init, a) => !pipe(init, readonlyArray.elem(E)(a)))

export const match =
  <A, B>(onEmpty: Lazy<B>, onNonEmpty: (head: A, tail: AsyncYield<A>) => B) =>
  (as: AsyncYield<A>): Task<B> =>
    pipe(
      as().next(),
      (a) => () =>
        a.then((_a) =>
          _a.done ? onEmpty() : onNonEmpty(_a.value, pipe(as, drop(1))),
        ),
    )

export const toTask =
  <A>(as: AsyncYield<A>): Task<ReadonlyArray<A>> =>
  async () => {
    const _as: Array<A> = []
    for await (const a of as()) {
      _as.push(a)
    }

    return _as
  }

export const isEmpty = match(constTrue, constFalse)

export const isNonEmpty = flow(
  isEmpty,
  task.map((a) => !a),
)

export const lookup =
  <A>(i: number) =>
  (as: AsyncYield<A>): Task<Option<A>> =>
    i < 0
      ? task.of(option.none)
      : pipe(
          as,
          drop(i),
          match(
            () => option.none,
            (a) => option.some(a),
          ),
        )

export const head = <A>(as: AsyncYield<A>): Task<Option<A>> =>
  pipe(as, lookup(0))

export function find<A, B extends A>(
  refinement: Refinement<A, B>,
): (as: AsyncYield<A>) => Task<Option<B>>
export function find<A>(
  predicate: Predicate<A>,
): (as: AsyncYield<A>) => Task<Option<A>>
export function find<A>(predicate: Predicate<A>) {
  return (as: AsyncYield<A>) => async () => {
    for await (const a of as()) {
      if (predicate(a)) {
        return option.some(a)
      }
    }

    return option.none
  }
}

export const elem =
  <A>(E: Eq<A>) =>
  (a: A) =>
    find((_a: A) => E.equals(a, _a))
