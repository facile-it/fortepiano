import * as Ei from 'fp-ts/Either'
import * as Eq from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as Se from 'fp-ts/Separated'
import * as St from 'fp-ts/string'
import {
  Alt,
  Alternative,
  Applicative,
  Apply,
  Chain,
  chainIOReadonlyArrayK,
  Compactable,
  drop,
  elem,
  exp,
  fibonacci,
  filter,
  filterMap,
  filterMapWithIndex,
  filterWithIndex,
  find,
  flatten,
  fromReadonlyArray,
  Functor,
  FunctorWithIndex,
  getMonoid,
  head,
  isEmpty,
  isNonEmpty,
  lookup,
  map,
  match,
  Monad,
  of,
  partition,
  partitionMap,
  partitionMapWithIndex,
  partitionWithIndex,
  prime,
  range,
  replicate,
  sieve,
  take,
  toReadonlyArray,
  uniq,
  zip,
} from './IOGenerator'

describe('IOGenerator', () => {
  describe('range', () => {
    it('should return a list of numbers', () => {
      expect(pipe(range(0), take(5), toReadonlyArray)).toStrictEqual([
        0, 1, 2, 3, 4,
      ])
      expect(pipe(range(1138), take(5), toReadonlyArray)).toStrictEqual([
        1138, 1139, 1140, 1141, 1142,
      ])
    })
    it('should allow starting from a negative number', () => {
      expect(pipe(range(-1337), take(5), toReadonlyArray)).toStrictEqual([
        -1337, -1336, -1335, -1334, -1333,
      ])
    })
  })

  describe('replicate', () => {
    it('should replicate the specified element', () => {
      expect(pipe(replicate(42), take(5), toReadonlyArray)).toStrictEqual([
        42, 42, 42, 42, 42,
      ])
    })
  })

  describe('fromReadonlyArray', () => {
    it('should transform an array into a generator', () => {
      expect(
        pipe(fromReadonlyArray([42, 1138, 1337]), toReadonlyArray),
      ).toStrictEqual([42, 1138, 1337])
    })
  })

  describe('prime', () => {
    it('should return a list of prime numbers', () => {
      expect(pipe(prime, take(5), toReadonlyArray)).toStrictEqual([
        2, 3, 5, 7, 11,
      ])
    })
  })

  describe('exp', () => {
    it('should return the exponential function', () => {
      expect(pipe(exp, take(5), toReadonlyArray)).toStrictEqual([
        Math.exp(0),
        Math.exp(1),
        Math.exp(2),
        Math.exp(3),
        Math.exp(4),
      ])
    })
  })

  describe('fibonacci', () => {
    it('should return the Fibonacci sequence', () => {
      expect(pipe(fibonacci, take(10), toReadonlyArray)).toStrictEqual([
        0, 1, 1, 2, 3, 5, 8, 13, 21, 34,
      ])
    })
  })

  describe('flatten', () => {
    it('should flatten nested generators', () => {
      expect(
        pipe(
          fromReadonlyArray([0, 1, 2]),
          // eslint-disable-next-line fp-ts/prefer-chain
          map((a) => fromReadonlyArray([3 * a, 3 * a + 1, 3 * a + 2])),
          flatten,
          toReadonlyArray,
        ),
      ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
    })
  })

  describe('take', () => {
    it('should select only specified elements', () => {
      const x = pipe(range(0), take(5), toReadonlyArray)

      expect(x).toHaveLength(5)
      expect(x).toStrictEqual([0, 1, 2, 3, 4])
    })
    it('should handle negative numbers', () => {
      const x = pipe(range(0), take(-Infinity), toReadonlyArray)

      expect(x).toHaveLength(0)
    })
  })

  describe('drop', () => {
    it('should select only specified elements', () => {
      const x = pipe(range(0), drop(5), take(5), toReadonlyArray)

      expect(x).toHaveLength(5)
      expect(x).toStrictEqual([5, 6, 7, 8, 9])
    })
    it('should handle negative numbers', () => {
      const x = pipe(range(0), drop(-Infinity), take(5), toReadonlyArray)

      expect(x).toHaveLength(5)
      expect(x).toStrictEqual([0, 1, 2, 3, 4])
    })
  })

  describe('zip', () => {
    it('should zip two lists together', () => {
      expect(
        pipe(range(0), zip(prime), take(5), toReadonlyArray),
      ).toStrictEqual([
        [0, 2],
        [1, 3],
        [2, 5],
        [3, 7],
        [4, 11],
      ])
    })
    it('should cut to the shortest list', () => {
      expect(
        pipe(pipe(range(0), take(5)), zip(prime), toReadonlyArray),
      ).toStrictEqual([
        [0, 2],
        [1, 3],
        [2, 5],
        [3, 7],
        [4, 11],
      ])
      expect(
        pipe(range(0), zip(pipe(prime, take(5))), toReadonlyArray),
      ).toStrictEqual([
        [0, 2],
        [1, 3],
        [2, 5],
        [3, 7],
        [4, 11],
      ])
    })
  })

  describe('sieve', () => {
    it('should allow filtering a list according to its past elements', () => {
      const atMost =
        <A>(E: Eq.Eq<A>) =>
        (n: number) =>
        (as: ReadonlyArray<A>, a: A): boolean =>
          pipe(
            as,
            RA.reduce(
              [true, 0] as Readonly<[boolean, number]>,
              ([all, m], _a) =>
                // eslint-disable-next-line no-nested-ternary
                all
                  ? E.equals(a, _a)
                    ? ([m + 1 < n, m + 1] as const)
                    : ([all, m] as const)
                  : ([all, m] as const),
            ),
            ([all]) => all,
          )

      expect(
        pipe(
          fromReadonlyArray([
            'a',
            'b',
            'a',
            'b',
            'a',
            'b',
            'a',
            'b',
            'a',
            'b',
            'b',
            'c',
            'b',
            'c',
            'b',
            'c',
            'b',
            'c',
            'b',
            'c',
          ]),
          sieve(atMost(St.Eq)(3)),
          toReadonlyArray,
        ),
      ).toStrictEqual(['a', 'b', 'a', 'b', 'a', 'b', 'c', 'c', 'c'])
    })
  })

  describe('uniq', () => {
    it('should remove repeated elements', () => {
      expect(
        pipe(
          fromReadonlyArray([
            'a',
            'b',
            'a',
            'b',
            'a',
            'b',
            'a',
            'b',
            'a',
            'b',
            'b',
            'c',
            'b',
            'c',
            'b',
            'c',
            'b',
            'c',
            'b',
            'c',
          ]),
          uniq(St.Eq),
          toReadonlyArray,
        ),
      ).toStrictEqual(['a', 'b', 'c'])
    })
  })

  describe('match', () => {
    it('should handle empty lists', () => {
      expect(
        pipe(
          getMonoid().empty,
          match(
            () => 'nil',
            (a) => `cons(${a})`,
          ),
        ),
      ).toBe('nil')
    })
    it('should handle non-empty lists', () => {
      expect(
        pipe(
          range(0),
          match(
            () => 'nil',
            (a) => `cons(${a})`,
          ),
        ),
      ).toBe('cons(0)')
    })
    it('should handle lists of one element', () => {
      expect(
        pipe(
          range(0),
          take(1),
          match(
            () => 'nil',
            (head, tail) =>
              `cons(${head}), ${pipe(
                tail,
                match(
                  () => 'nil',
                  (a) => `cons(${a})`,
                ),
              )}`,
          ),
        ),
      ).toBe('cons(0), nil')
    })
    it('should handle infinite lists', () => {
      expect(
        pipe(
          range(0),
          match(
            () => 'nil',
            (head, tail) =>
              `cons(${head}), ${pipe(
                tail,
                match(
                  () => 'nil',
                  (a) => `cons(${a})`,
                ),
              )}`,
          ),
        ),
      ).toBe('cons(0), cons(1)')
    })
  })

  describe('toReadonlyArray', () => {
    it('should transform a generator into an array', () => {
      expect(
        pipe(
          () =>
            (function* () {
              yield 42
              yield 1138
              yield 1337
            })(),
          toReadonlyArray,
        ),
      ).toStrictEqual([42, 1138, 1337])
    })
  })

  describe('isEmpty', () => {
    it('should recognize empty lists', () => {
      expect(pipe(getMonoid().empty, isEmpty)).toBe(true)
    })
    it('should recognize non-empty lists', () => {
      expect(pipe(range(0), isEmpty)).toBe(false)
    })
  })

  describe('isNonEmpty', () => {
    it('should recognize empty lists', () => {
      expect(pipe(getMonoid().empty, isNonEmpty)).toBe(false)
    })
    it('should recognize non-empty lists', () => {
      expect(pipe(range(0), isNonEmpty)).toBe(true)
    })
  })

  describe('lookup', () => {
    it('should return None when the index is out of bound', () => {
      expect(pipe(range(0), take(5), lookup(5))).toStrictEqual(O.none)
    })
    it('should return Some when the index is in bound', () => {
      expect(pipe(range(0), take(5), lookup(4))).toStrictEqual(O.some(4))
    })
    it('should handle negative numbers', () => {
      expect(pipe(range(0), lookup(-Infinity))).toStrictEqual(O.none)
    })
  })

  describe('head', () => {
    it('should return None with empty lists', () => {
      expect(pipe(getMonoid().empty, head)).toStrictEqual(O.none)
    })
    it('should return Some with non-empty lists', () => {
      expect(pipe(range(0), head)).toStrictEqual(O.some(0))
    })
  })

  describe('find', () => {
    it('should return None when no element is found', () => {
      expect(
        pipe(
          range(0),
          take(5),
          find((n) => n >= 5),
        ),
      ).toStrictEqual(O.none)
    })
    it('should return Some when an element is found', () => {
      expect(
        pipe(
          range(0),
          find((n) => n >= 4),
        ),
      ).toStrictEqual(O.some(4))
    })
  })

  describe('elem', () => {
    it('should return None when the element is not found', () => {
      expect(pipe(range(0), take(5), elem(N.Eq)(5))).toStrictEqual(O.none)
    })
    it('should return Some when the element is found', () => {
      expect(pipe(range(0), elem(N.Eq)(4))).toStrictEqual(O.some(4))
    })
  })

  describe('Monoid', () => {
    const { empty, concat } = getMonoid<number>()
    const a = fromReadonlyArray([0, 1, 2])
    const b = fromReadonlyArray([3, 4, 5])
    const c = fromReadonlyArray([6, 7, 8])

    it('associativity', () => {
      expect(pipe(concat(a, concat(b, c)), toReadonlyArray)).toStrictEqual(
        pipe(concat(concat(a, b), c), toReadonlyArray),
      )
    })
    it('identity', () => {
      expect(pipe(concat(empty, empty), toReadonlyArray)).toStrictEqual(
        pipe(empty, toReadonlyArray),
      )
      expect(pipe(concat(a, empty), toReadonlyArray)).toStrictEqual(
        pipe(a, toReadonlyArray),
      )
      expect(pipe(concat(empty, a), toReadonlyArray)).toStrictEqual(
        pipe(a, toReadonlyArray),
      )
    })

    it('should concatenate generated values', () => {
      expect(pipe(concat(a, concat(b, c)), toReadonlyArray)).toStrictEqual([
        0, 1, 2, 3, 4, 5, 6, 7, 8,
      ])
    })
  })

  describe('Functor', () => {
    const fa = fromReadonlyArray([0, 1, 2])

    it('identity', () => {
      expect(
        pipe(
          Functor.map(fa, (a) => a),
          toReadonlyArray,
        ),
      ).toStrictEqual(pipe(fa, toReadonlyArray))
    })
    it('composition', () => {
      const ab = (a: number) => a + 1
      const bc = (a: number) => a / 2

      expect(
        pipe(
          Functor.map(fa, (a) => bc(ab(a))),
          toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(Functor.map(Functor.map(fa, ab), bc), toReadonlyArray),
      )
    })
  })

  describe('FunctorWithIndex', () => {
    const fa = fromReadonlyArray([0, 1, 2])

    it('identity', () => {
      expect(
        pipe(
          FunctorWithIndex.mapWithIndex(fa, (_, a) => a),
          toReadonlyArray,
        ),
      ).toStrictEqual(pipe(fa, toReadonlyArray))
    })
    it('composition', () => {
      const ab = (a: number) => a + 1
      const bc = (a: number) => a / 2

      expect(
        pipe(
          FunctorWithIndex.mapWithIndex(fa, (_, a) => bc(ab(a))),
          toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(
          FunctorWithIndex.mapWithIndex(
            FunctorWithIndex.mapWithIndex(fa, (_, a) => ab(a)),
            (_, b) => bc(b),
          ),
          toReadonlyArray,
        ),
      )
    })
  })

  describe('Apply', () => {
    const fa = fromReadonlyArray([0, 1, 2])
    const ab = (a: number) => a + 1
    const bc = (a: number) => a / 2

    it('associative composition', () => {
      expect(
        pipe(
          Apply.ap(
            Apply.ap(
              Apply.map(
                of(bc),
                (bc) => (ab: (a: number) => number) => (a: number) => bc(ab(a)),
              ),
              of(ab),
            ),
            fa,
          ),
          toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(Apply.ap(of(bc), Apply.ap(of(ab), fa)), toReadonlyArray),
      )
    })
  })

  describe('Applicative', () => {
    const a = 42
    const fa = fromReadonlyArray([0, 1, 2])
    const ab = (a: number) => a + 1

    it('identity', () => {
      expect(
        pipe(
          Applicative.ap(
            Applicative.of((a: number) => a),
            fa,
          ),
          toReadonlyArray,
        ),
      ).toStrictEqual(pipe(fa, toReadonlyArray))
    })
    it('homomorphism', () => {
      expect(
        pipe(
          Applicative.ap(Applicative.of(ab), Applicative.of(a)),
          toReadonlyArray,
        ),
      ).toStrictEqual(pipe(Applicative.of(ab(a)), toReadonlyArray))
    })
    it('interchange', () => {
      expect(
        pipe(
          Applicative.ap(Applicative.of(ab), Applicative.of(a)),
          toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(
          Applicative.ap(
            Applicative.of((ab: (a: number) => number) => ab(a)),
            Applicative.of(ab),
          ),
          toReadonlyArray,
        ),
      )
    })
  })

  describe('Chain', () => {
    const fa = fromReadonlyArray([0, 1, 2])
    const afb = (a: number) => of(a + 1)
    const bfc = (a: number) => of(a / 2)

    it('associativity', () => {
      expect(
        pipe(Chain.chain(Chain.chain(fa, afb), bfc), toReadonlyArray),
      ).toStrictEqual(
        pipe(
          Chain.chain(fa, (a) => Chain.chain(afb(a), bfc)),
          toReadonlyArray,
        ),
      )
    })
  })

  describe('Monad', () => {
    const a = 42
    const fa = fromReadonlyArray([0, 1, 2])
    const f = (a: number) => of(a + 1)

    it('left identity', () => {
      expect(pipe(Monad.chain(Monad.of(a), f), toReadonlyArray)).toStrictEqual(
        pipe(f(a), toReadonlyArray),
      )
    })
    it('right identity', () => {
      expect(pipe(Monad.chain(fa, Monad.of), toReadonlyArray)).toStrictEqual(
        pipe(fa, toReadonlyArray),
      )
    })
  })

  describe('FromIO', () => {
    describe('chainIOReadonlyArrayK', () => {
      it('should chain a generator with an IO of a list', () => {
        const M = pipe(
          prime,
          drop(5),
          take(3),
          chainIOReadonlyArrayK((n) => () => [
            n * Math.random(),
            n * Math.random(),
            n * Math.random(),
          ]),
        )

        for (let i = 0; i < 10; i++) {
          const x = pipe(M, toReadonlyArray)

          expect(x).toHaveLength(9)
          expect(x[0]).toBeLessThan(13)
          expect(x[1]).toBeLessThan(13)
          expect(x[2]).toBeLessThan(13)
          expect(x[3]).toBeLessThan(17)
          expect(x[4]).toBeLessThan(17)
          expect(x[5]).toBeLessThan(17)
          expect(x[6]).toBeLessThan(19)
          expect(x[7]).toBeLessThan(19)
          expect(x[8]).toBeLessThan(19)
        }
      })
    })
  })

  describe('Alt', () => {
    const fa = fromReadonlyArray([0, 1, 2])
    const ga = fromReadonlyArray([3, 4, 5])
    const ha = fromReadonlyArray([6, 7, 8])

    it('associativity', () => {
      expect(
        pipe(
          Alt.alt(
            Alt.alt(fa, () => ga),
            () => ha,
          ),
          toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(
          Alt.alt(fa, () => Alt.alt(ga, () => ha)),
          toReadonlyArray,
        ),
      )
    })
    it('distributivity', () => {
      const ab = (a: number) => a + 1

      expect(
        pipe(
          Alt.map(
            Alt.alt(fa, () => ga),
            ab,
          ),
          toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(
          Alt.alt(Alt.map(fa, ab), () => Alt.map(ga, ab)),
          toReadonlyArray,
        ),
      )
    })
  })

  describe('Alternative', () => {
    const fa = fromReadonlyArray([0, 1, 2])

    it('left identity', () => {
      expect(
        pipe(
          Alternative.alt(Alternative.zero(), () => fa),
          toReadonlyArray,
        ),
      ).toStrictEqual(pipe(fa, toReadonlyArray))
    })
    it('right identity', () => {
      expect(
        pipe(Alternative.alt(fa, Alternative.zero), toReadonlyArray),
      ).toStrictEqual(pipe(fa, toReadonlyArray))
    })
    it('annihilation', () => {
      const f = (a: number) => a + 1

      expect(
        pipe(Alternative.map(Alternative.zero(), f), toReadonlyArray),
      ).toStrictEqual(pipe(Alternative.zero(), toReadonlyArray))
    })
    it('distributivity', () => {
      const fab = of((a: number) => a + 1)
      const gab = of((a: number) => a / 2)

      expect(
        pipe(
          Alternative.ap(
            Alternative.alt(fab, () => gab),
            fa,
          ),
          toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(
          Alternative.alt(Alternative.ap(fab, fa), () =>
            Alternative.ap(gab, fa),
          ),
          toReadonlyArray,
        ),
      )
    })
    it('annihilation', () => {
      expect(
        pipe(Alternative.ap(Alternative.zero(), fa), toReadonlyArray),
      ).toStrictEqual(pipe(Alternative.zero(), toReadonlyArray))
    })
  })

  describe('Compactable', () => {
    describe('compact', () => {
      it('should remove None elements', () => {
        expect(
          pipe(
            fromReadonlyArray([
              O.none,
              O.some(0),
              O.none,
              O.some(1),
              O.none,
              O.some(2),
            ]),
            Compactable.compact,
            toReadonlyArray,
          ),
        ).toStrictEqual([0, 1, 2])
      })
    })

    describe('separate', () => {
      it('should split Left and Right elements', () => {
        expect(
          pipe(
            fromReadonlyArray([
              Ei.left('a'),
              Ei.right(0),
              Ei.left('b'),
              Ei.right(1),
              Ei.left('c'),
              Ei.right(2),
            ]),
            Compactable.separate,
            (as) =>
              Se.separated(toReadonlyArray(as.left), toReadonlyArray(as.right)),
          ),
        ).toStrictEqual(Se.separated(['a', 'b', 'c'], [0, 1, 2]))
      })
    })
  })

  describe('Filterable', () => {
    describe('filter', () => {
      it('should filter elements', () => {
        expect(
          pipe(
            range(0),
            take(10),
            filter((n) => 0 !== n % 2),
            toReadonlyArray,
          ),
        ).toStrictEqual([1, 3, 5, 7, 9])
      })
    })

    describe('filterMap', () => {
      it('should filter and transform elements', () => {
        expect(
          pipe(
            range(0),
            take(10),
            filterMap((n) => (0 !== n % 2 ? O.some(2 * n) : O.none)),
            toReadonlyArray,
          ),
        ).toStrictEqual([2, 6, 10, 14, 18])
      })
    })

    describe('partition', () => {
      it('should split elements', () => {
        expect(
          pipe(
            range(0),
            take(10),
            partition((n) => 0 !== n % 2),
            (as) =>
              Se.separated(toReadonlyArray(as.left), toReadonlyArray(as.right)),
          ),
        ).toStrictEqual(Se.separated([0, 2, 4, 6, 8], [1, 3, 5, 7, 9]))
      })
    })

    describe('partitionMap', () => {
      it('should split and transform elements', () => {
        expect(
          pipe(
            range(0),
            take(10),
            partitionMap((n) =>
              0 !== n % 2 ? Ei.right(2 * n) : Ei.left(-2 * n),
            ),
            (as) =>
              Se.separated(toReadonlyArray(as.left), toReadonlyArray(as.right)),
          ),
        ).toStrictEqual(
          Se.separated([-0, -4, -8, -12, -16], [2, 6, 10, 14, 18]),
        )
      })
    })
  })

  describe('FilterableWithIndex', () => {
    describe('filterWithIndex', () => {
      it('should filter elements using their index', () => {
        expect(
          pipe(
            range(0),
            take(10),
            filterWithIndex((i, n) => i < 5 && 0 !== n % 2),
            toReadonlyArray,
          ),
        ).toStrictEqual([1, 3])
      })
    })

    describe('filterMapWithIndex', () => {
      it('should filter and transform elements using their index', () => {
        expect(
          pipe(
            range(0),
            take(10),
            filterMapWithIndex((i, n) =>
              i < 5 && 0 !== n % 2 ? O.some(2 * n) : O.none,
            ),
            toReadonlyArray,
          ),
        ).toStrictEqual([2, 6])
      })
    })

    describe('partitionWithIndex', () => {
      it('should split elements using their index', () => {
        expect(
          pipe(
            range(0),
            take(10),
            partitionWithIndex((i, n) => i < 5 && 0 !== n % 2),
            (as) =>
              Se.separated(toReadonlyArray(as.left), toReadonlyArray(as.right)),
          ),
        ).toStrictEqual(Se.separated([0, 2, 4, 5, 6, 7, 8, 9], [1, 3]))
      })
    })

    describe('partitionMapWithIndex', () => {
      it('should split and transform elements using their index', () => {
        expect(
          pipe(
            range(0),
            take(10),
            partitionMapWithIndex((i, n) =>
              i < 5 && 0 !== n % 2 ? Ei.right(2 * n) : Ei.left(-2 * n),
            ),
            (as) =>
              Se.separated(toReadonlyArray(as.left), toReadonlyArray(as.right)),
          ),
        ).toStrictEqual(
          Se.separated([-0, -4, -8, -10, -12, -14, -16, -18], [2, 6]),
        )
      })
    })
  })
})
