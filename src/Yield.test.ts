import * as Ei from 'fp-ts/Either'
import * as Eq from 'fp-ts/Eq'
import { flow, pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as Se from 'fp-ts/Separated'
import * as St from 'fp-ts/string'
import {
  Alt,
  Alternative,
  append,
  Applicative,
  Apply,
  Chain,
  chunksOf,
  Compactable,
  deleteAt,
  dropLeft,
  dropLeftWhile,
  duplicate,
  elem,
  exp,
  fibonacci,
  filter,
  filterMap,
  filterMapWithIndex,
  filterWithIndex,
  findFirstIndex,
  findLast,
  findLastIndex,
  findLastMap,
  flatten,
  foldMapWithIndex,
  FromIO,
  fromReadonlyArray,
  fromReadonlyRecord,
  Functor,
  FunctorWithIndex,
  getEq,
  getMonoid,
  getOrd,
  head,
  init,
  insertAt,
  intersperse,
  isEmpty,
  isNonEmpty,
  lefts,
  lookup,
  makeBy,
  map,
  matchLeft,
  matchRight,
  Monad,
  of,
  partition,
  partitionMap,
  partitionMapWithIndex,
  partitionWithIndex,
  prepend,
  prime,
  range,
  replicate,
  reverse,
  rights,
  rotate,
  scanRight,
  sequence,
  sieve,
  size,
  spanLeft,
  splitAt,
  tail,
  takeLeft,
  takeLeftWhile,
  toReadonlyArray,
  unfold,
  uniq,
  unzip,
  updateAt,
  wilt,
  wither,
  zip,
} from './Yield'

describe('Yield', () => {
  describe('makeBy', () => {
    it('should create a generator using a function', () => {
      expect(
        pipe(
          makeBy((i) => Math.sin((i * Math.PI) / 4)),
          takeLeft(8),
          toReadonlyArray,
        ),
      ).toStrictEqual([
        Math.sin((0 * Math.PI) / 4),
        Math.sin(Math.PI / 4),
        Math.sin((2 * Math.PI) / 4),
        Math.sin((3 * Math.PI) / 4),
        Math.sin((4 * Math.PI) / 4),
        Math.sin((5 * Math.PI) / 4),
        Math.sin((6 * Math.PI) / 4),
        Math.sin((7 * Math.PI) / 4),
      ])
    })
  })

  describe('range', () => {
    it('should return a list of numbers', () => {
      expect(pipe(range(0), takeLeft(5), toReadonlyArray)).toStrictEqual([
        0, 1, 2, 3, 4,
      ])
      expect(pipe(range(1138), takeLeft(5), toReadonlyArray)).toStrictEqual([
        1138, 1139, 1140, 1141, 1142,
      ])
    })
    it('should allow starting from a negative number', () => {
      expect(pipe(range(-1337), takeLeft(5), toReadonlyArray)).toStrictEqual([
        -1337, -1336, -1335, -1334, -1333,
      ])
    })
    it('should allow setting a top boundary', () => {
      expect(pipe(range(0, 9), toReadonlyArray)).toStrictEqual([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      ])
      expect(pipe(range(42, 49), toReadonlyArray)).toStrictEqual([
        42, 43, 44, 45, 46, 47, 48, 49,
      ])
    })
    it('should support a top boundary smaller than the bottom one', () => {
      expect(pipe(range(42, -Infinity), toReadonlyArray)).toStrictEqual([42])
    })
  })

  describe('replicate', () => {
    it('should replicate the specified element', () => {
      expect(pipe(replicate(42), takeLeft(5), toReadonlyArray)).toStrictEqual([
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

  describe('fromReadonlyRecord', () => {
    it('should transform a record into a generator', () => {
      expect(
        pipe(
          fromReadonlyRecord({ foo: 42, bar: 1138, max: 1337 }),
          toReadonlyArray,
        ),
      ).toStrictEqual([
        ['bar', 1138],
        ['foo', 42],
        ['max', 1337],
      ])
    })
  })

  describe('prime', () => {
    it('should return a list of prime numbers', () => {
      expect(pipe(prime, takeLeft(5), toReadonlyArray)).toStrictEqual([
        2, 3, 5, 7, 11,
      ])
    })
  })

  describe('exp', () => {
    it('should return the exponential function', () => {
      expect(pipe(exp, takeLeft(5), toReadonlyArray)).toStrictEqual([
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
      expect(pipe(fibonacci, takeLeft(10), toReadonlyArray)).toStrictEqual([
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

  describe('prepend', () => {
    it('should add an element at the top of the list', () => {
      expect(
        pipe(prime, prepend(42), takeLeft(5), toReadonlyArray),
      ).toStrictEqual([42, 2, 3, 5, 7])
    })
  })

  describe('append', () => {
    it('should add an element at the bottom of the list', () => {
      expect(
        pipe(prime, takeLeft(5), append(42), toReadonlyArray),
      ).toStrictEqual([2, 3, 5, 7, 11, 42])
    })
  })

  describe('takeLeft', () => {
    it('should select only specified elements', () => {
      const x = pipe(range(0), takeLeft(5), toReadonlyArray)

      expect(x).toHaveLength(5)
      expect(x).toStrictEqual([0, 1, 2, 3, 4])
    })
    it('should handle negative numbers', () => {
      const x = pipe(range(0), takeLeft(-Infinity), toReadonlyArray)

      expect(x).toHaveLength(0)
    })
  })

  describe('takeLeftWhile', () => {
    it('should select elements according to a predicate', () => {
      expect(
        pipe(
          prime,
          takeLeftWhile((n) => n <= 10),
          toReadonlyArray,
        ),
      ).toStrictEqual([2, 3, 5, 7])
    })
    it('should handle always false predicates', () => {
      expect(
        pipe(
          prime,
          takeLeftWhile(() => false),
          toReadonlyArray,
        ),
      ).toStrictEqual([])
    })
  })

  describe('dropLeft', () => {
    it('should drop specified elements', () => {
      const x = pipe(range(0), dropLeft(5), takeLeft(5), toReadonlyArray)

      expect(x).toHaveLength(5)
      expect(x).toStrictEqual([5, 6, 7, 8, 9])
    })
    it('should handle negative numbers', () => {
      const x = pipe(
        range(0),
        dropLeft(-Infinity),
        takeLeft(5),
        toReadonlyArray,
      )

      expect(x).toHaveLength(5)
      expect(x).toStrictEqual([0, 1, 2, 3, 4])
    })
  })

  describe('dropLeftWhile', () => {
    it('should drop elements according to a predicate', () => {
      expect(
        pipe(
          prime,
          dropLeftWhile((n) => n < 10),
          takeLeft(5),
          toReadonlyArray,
        ),
      ).toStrictEqual([11, 13, 17, 19, 23])
    })
    it('should handle always false predicates', () => {
      expect(
        pipe(
          prime,
          dropLeftWhile(() => false),
          takeLeft(5),
          toReadonlyArray,
        ),
      ).toStrictEqual([2, 3, 5, 7, 11])
    })
  })

  describe('zip', () => {
    it('should zip two lists together', () => {
      expect(
        pipe(range(0), zip(prime), takeLeft(5), toReadonlyArray),
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
        pipe(pipe(range(0), takeLeft(5)), zip(prime), toReadonlyArray),
      ).toStrictEqual([
        [0, 2],
        [1, 3],
        [2, 5],
        [3, 7],
        [4, 11],
      ])
      expect(
        pipe(range(0), zip(pipe(prime, takeLeft(5))), toReadonlyArray),
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

  describe('scanRight', () => {
    it('should return all steps of a reduction', () => {
      expect(
        pipe(
          range(0),
          takeLeft(5),
          scanRight(0, (b, a) => a + b),
          toReadonlyArray,
        ),
      ).toStrictEqual([10, 6, 3, 1, 0, 0])
    })
  })

  describe('spanLeft', () => {
    it('should split the list when given condition is not met', () => {
      expect(
        pipe(
          prime,
          takeLeft(5),
          spanLeft((n) => 0 !== n % 5),
          ({ init, rest }) => ({
            init: toReadonlyArray(init),
            rest: toReadonlyArray(rest),
          }),
        ),
      ).toStrictEqual({ init: [2, 3], rest: [5, 7, 11] })
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

  describe('reverse', () => {
    it('should return the inverted list', () => {
      expect(pipe(prime, takeLeft(5), reverse, toReadonlyArray)).toStrictEqual([
        11, 7, 5, 3, 2,
      ])
    })
  })

  describe('rights', () => {
    it('should extract Right values', () => {
      expect(
        pipe(
          fromReadonlyArray([
            Ei.right(0),
            Ei.left(1),
            Ei.right(2),
            Ei.left(3),
            Ei.right(4),
          ]),
          rights,
          toReadonlyArray,
        ),
      ).toStrictEqual([0, 2, 4])
    })
  })

  describe('lefts', () => {
    it('should extract Left values', () => {
      expect(
        pipe(
          fromReadonlyArray([
            Ei.right(0),
            Ei.left(1),
            Ei.right(2),
            Ei.left(3),
            Ei.right(4),
          ]),
          lefts,
          toReadonlyArray,
        ),
      ).toStrictEqual([1, 3])
    })
  })

  describe('intersperse', () => {
    it('should insert given element between each pair of list elements', () => {
      expect(
        pipe(prime, intersperse(42), takeLeft(5), toReadonlyArray),
      ).toStrictEqual([2, 42, 3, 42, 5])
    })
    it('should handle empty lists', () => {
      expect(pipe(prime, takeLeft(0), toReadonlyArray)).toStrictEqual([])
    })
  })

  describe('rotate', () => {
    it('should rotate the list by given steps', () => {
      expect(
        pipe(prime, takeLeft(5), rotate(2), toReadonlyArray),
      ).toStrictEqual([7, 11, 2, 3, 5])
    })
    it('should handle negative numbers', () => {
      expect(
        pipe(prime, takeLeft(5), rotate(-2), toReadonlyArray),
      ).toStrictEqual([5, 7, 11, 2, 3])
    })
  })

  describe('chunksOf', () => {
    it('should split the list into chunks of a given size', () => {
      expect(
        pipe(
          prime,
          takeLeft(10),
          chunksOf(3),
          map(toReadonlyArray),
          toReadonlyArray,
        ),
      ).toStrictEqual([[2, 3, 5], [7, 11, 13], [17, 19, 23], [29]])
    })
    it('should force the chunk size to be at least 1', () => {
      expect(
        pipe(
          prime,
          takeLeft(5),
          chunksOf(-Infinity),
          map(toReadonlyArray),
          toReadonlyArray,
        ),
      ).toStrictEqual([[2], [3], [5], [7], [11]])
    })
    it('should handle empty lists', () => {
      expect(
        pipe(
          prime,
          takeLeft(0),
          chunksOf(3),
          map(toReadonlyArray),
          toReadonlyArray,
        ),
      ).toStrictEqual([])
    })
  })

  describe('matchLeft', () => {
    it('should handle empty lists', () => {
      expect(
        pipe(
          getMonoid().empty,
          matchLeft(
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
          matchLeft(
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
          takeLeft(1),
          matchLeft(
            () => 'nil',
            (head, tail) =>
              `cons(${head}), ${pipe(
                tail,
                matchLeft(
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
          matchLeft(
            () => 'nil',
            (head, tail) =>
              `cons(${head}), ${pipe(
                tail,
                matchLeft(
                  () => 'nil',
                  (a) => `cons(${a})`,
                ),
              )}`,
          ),
        ),
      ).toBe('cons(0), cons(1)')
    })
  })

  describe('matchRight', () => {
    it('should handle empty lists', () => {
      expect(
        pipe(
          prime,
          takeLeft(0),
          matchRight(
            () => [],
            (init, last) => [toReadonlyArray(init), last],
          ),
        ),
      ).toHaveLength(0)
    })
    it('should handle non-empty lists', () => {
      expect(
        pipe(
          prime,
          takeLeft(5),
          matchRight(
            () => [],
            (init, last) => [toReadonlyArray(init), last],
          ),
        ),
      ).toStrictEqual([[2, 3, 5, 7], 11])
    })
    it('should handle lists of one element', () => {
      expect(
        pipe(
          prime,
          takeLeft(1),
          matchRight(
            () => [],
            (init, last) => [toReadonlyArray(init), last],
          ),
        ),
      ).toStrictEqual([[], 2])
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

  describe('tail', () => {
    it('should return all elements but first one', () => {
      expect(
        pipe(prime, takeLeft(5), tail, O.map(toReadonlyArray)),
      ).toStrictEqual(O.some([3, 5, 7, 11]))
    })
    it('should fail with empty lists', () => {
      expect(
        pipe(prime, takeLeft(0), tail, O.map(toReadonlyArray)),
      ).toStrictEqual(O.none)
    })
  })

  describe('init', () => {
    it('should return all elements but last one', () => {
      expect(
        pipe(prime, takeLeft(5), init, O.map(toReadonlyArray)),
      ).toStrictEqual(O.some([2, 3, 5, 7]))
    })
    it('should fail with empty lists', () => {
      expect(
        pipe(prime, takeLeft(0), init, O.map(toReadonlyArray)),
      ).toStrictEqual(O.none)
    })
  })

  describe('splitAt', () => {
    it('should split a list at a given position', () => {
      const x = pipe(prime, takeLeft(10), splitAt(5))

      expect(pipe(x[0], toReadonlyArray)).toStrictEqual([2, 3, 5, 7, 11])
      expect(pipe(x[1], toReadonlyArray)).toStrictEqual([13, 17, 19, 23, 29])
    })
    it('should handle negative indices', () => {
      const x = pipe(prime, takeLeft(5), splitAt(-Infinity))

      expect(pipe(x[0], toReadonlyArray)).toStrictEqual([])
      expect(pipe(x[1], toReadonlyArray)).toStrictEqual([2, 3, 5, 7, 11])
    })
    it('should handle out of scale indices', () => {
      const x = pipe(prime, takeLeft(5), splitAt(Infinity))

      expect(pipe(x[0], toReadonlyArray)).toStrictEqual([2, 3, 5, 7, 11])
      expect(pipe(x[1], toReadonlyArray)).toStrictEqual([])
    })
  })

  describe('unzip', () => {
    it('should restore two zipped lists', () => {
      expect(
        pipe(prime, zip(range(0)), takeLeft(5), unzip, ([a, b]) => [
          toReadonlyArray(a),
          toReadonlyArray(b),
        ]),
      ).toStrictEqual([
        [2, 3, 5, 7, 11],
        [0, 1, 2, 3, 4],
      ])
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

  describe('size', () => {
    it('should return list size', () => {
      expect(pipe(prime, takeLeft(5), size)).toBe(5)
    })
    it('should handle empty lists', () => {
      expect(pipe(prime, takeLeft(0), size)).toBe(0)
    })
  })

  describe('lookup', () => {
    it('should return None when the index is out of bound', () => {
      expect(pipe(range(0), takeLeft(5), lookup(5))).toStrictEqual(O.none)
    })
    it('should return Some when the index is in bound', () => {
      expect(pipe(range(0), takeLeft(5), lookup(4))).toStrictEqual(O.some(4))
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

  describe('findFirstIndex', () => {
    it('should find first matching element and return its index', () => {
      expect(
        pipe(
          range(0),
          takeLeft(5),
          findFirstIndex((i) => 0 !== i % 2),
        ),
      ).toStrictEqual(O.some(1))
    })
    it('should return None when no element is found', () => {
      expect(
        pipe(
          range(0),
          takeLeft(5),
          findFirstIndex((i) => i >= 5),
        ),
      ).toStrictEqual(O.none)
    })
  })

  describe('findLast', () => {
    it('should return None when no element is found', () => {
      expect(
        pipe(
          range(0),
          takeLeft(5),
          findLast((n) => n >= 5),
        ),
      ).toStrictEqual(O.none)
    })
    it('should return Some when an element is found', () => {
      expect(
        pipe(
          range(0),
          takeLeft(5),
          findLast((n) => n >= 4),
        ),
      ).toStrictEqual(O.some(4))
    })
  })

  describe('findLastMap', () => {
    it('should find last matching element and transform it', () => {
      expect(
        pipe(
          range(0),
          takeLeft(5),
          findLastMap((i) =>
            0 === i % 2
              ? O.none
              : O.some(String.fromCharCode('a'.charCodeAt(0) + i)),
          ),
        ),
      ).toStrictEqual(O.some('d'))
    })
    it('should return None when no element is found', () => {
      expect(
        pipe(
          range(0),
          takeLeft(5),
          findLastMap((i) =>
            i < 5 ? O.none : O.some(String.fromCharCode('a'.charCodeAt(0) + i)),
          ),
        ),
      ).toStrictEqual(O.none)
    })
  })

  describe('findLastIndex', () => {
    it('should find last matching element and return its index', () => {
      expect(
        pipe(
          range(0),
          takeLeft(5),
          findLastIndex((i) => 0 !== i % 2),
        ),
      ).toStrictEqual(O.some(3))
    })
    it('should return None when no element is found', () => {
      expect(
        pipe(
          range(0),
          takeLeft(5),
          findLastIndex((i) => i >= 5),
        ),
      ).toStrictEqual(O.none)
    })
  })

  describe('elem', () => {
    it('should return None when the element is not found', () => {
      expect(pipe(range(0), takeLeft(5), elem(N.Eq)(5))).toStrictEqual(O.none)
    })
    it('should return Some when the element is found', () => {
      expect(pipe(range(0), elem(N.Eq)(4))).toStrictEqual(O.some(4))
    })
  })

  describe('insertAt', () => {
    it('should insert an element at a given position', () => {
      expect(
        pipe(prime, insertAt(2, 42), O.map(flow(takeLeft(5), toReadonlyArray))),
      ).toStrictEqual(O.some([2, 3, 42, 5, 7]))
    })
    it('should handle out of bound indices', () => {
      expect(
        pipe(
          prime,
          takeLeft(5),
          insertAt(Infinity, 42),
          O.map(toReadonlyArray),
        ),
      ).toStrictEqual(O.none)
    })
  })

  describe('updateAt', () => {
    it('should update an element at a given position', () => {
      expect(
        pipe(prime, updateAt(2, 42), O.map(flow(takeLeft(5), toReadonlyArray))),
      ).toStrictEqual(O.some([2, 3, 42, 7, 11]))
    })
    it('should handle out of bound indices', () => {
      expect(
        pipe(
          prime,
          takeLeft(5),
          updateAt(Infinity, 42),
          O.map(toReadonlyArray),
        ),
      ).toStrictEqual(O.none)
    })
  })

  describe('deleteAt', () => {
    it('should delete an element at a given position', () => {
      expect(
        pipe(prime, deleteAt(2), O.map(flow(takeLeft(5), toReadonlyArray))),
      ).toStrictEqual(O.some([2, 3, 7, 11, 13]))
    })
    it('should handle out of bound indices', () => {
      expect(
        pipe(prime, takeLeft(5), deleteAt(Infinity), O.map(toReadonlyArray)),
      ).toStrictEqual(O.none)
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

  describe('Eq', () => {
    const { equals } = getEq<number>(N.Eq)
    const fa = fromReadonlyArray([0, 1, 2])
    const fb = pipe(range(0), takeLeft(3))
    const fc = function* () {
      yield 0
      yield 1
      yield 2
    }
    const fd = fromReadonlyArray([3, 4, 5])

    it('reflexivity', () => {
      expect(equals(fa, fa)).toBe(true)
    })
    it('symmetry', () => {
      expect(equals(fa, fb)).toBe(equals(fb, fa))
      expect(equals(fa, fd)).toBe(equals(fd, fa))
    })
    it('transitivity', () => {
      expect(equals(fa, fb)).toBe(true)
      expect(equals(fb, fc)).toBe(true)
      expect(equals(fa, fc)).toBe(true)

      expect(equals(fa, fd)).toBe(false)
      expect(equals(fb, fd)).toBe(false)
      expect(equals(fc, fd)).toBe(false)
    })
  })

  describe('Ord', () => {
    const { equals, compare } = getOrd<number>(N.Ord)
    const fa = fromReadonlyArray([0, 1, 2])
    const fb = pipe(range(3), takeLeft(3))
    const fc = function* () {
      yield 6
      yield 7
      yield 8
    }
    const fd = fromReadonlyArray([0, 1, 2])

    it('reflexivity', () => {
      expect(compare(fa, fa)).toBeLessThanOrEqual(0)
    })
    it('antisymmetry', () => {
      expect(compare(fa, fd)).toBeLessThanOrEqual(0)
      expect(compare(fd, fa)).toBeLessThanOrEqual(0)
      expect(equals(fa, fd)).toBe(true)
    })
    it('transitivity', () => {
      expect(compare(fa, fb)).toBeLessThanOrEqual(0)
      expect(compare(fb, fc)).toBeLessThanOrEqual(0)
      expect(compare(fa, fc)).toBeLessThanOrEqual(0)

      expect(compare(fa, fd)).toBeLessThanOrEqual(0)
      expect(compare(fb, fd)).toBeGreaterThan(0)
      expect(compare(fc, fd)).toBeGreaterThan(0)
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
    describe('fromIO', () => {
      it('should generate values using an IO', () => {
        const now = Date.now()
        const as = pipe(
          FromIO.fromIO(() => Date.now()),
          takeLeft(100),
          toReadonlyArray,
        )

        expect(as[0]).toBeGreaterThanOrEqual(now)
        expect(as[99]).toBeLessThanOrEqual(Date.now())
      })
    })
  })

  describe('Unfoldable', () => {
    describe('unfold', () => {
      it('should return a list starting from a given value using a function', () => {
        const factors = unfold((b: number) =>
          pipe(
            prime,
            takeLeftWhile((n) => n <= b),
            dropLeftWhile((n) => 0 !== b % n),
            head,
            O.map((n) => [n, b / n]),
          ),
        )

        expect(pipe(42, factors, toReadonlyArray)).toStrictEqual([2, 3, 7])
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

  describe('Extend', () => {
    describe('duplicate', () => {
      it('should duplicate the list on each element', () => {
        expect(
          pipe(
            prime,
            takeLeft(5),
            duplicate,
            map(toReadonlyArray),
            toReadonlyArray,
          ),
        ).toStrictEqual([
          [2, 3, 5, 7, 11],
          [3, 5, 7, 11],
          [5, 7, 11],
          [7, 11],
          [11],
        ])
      })
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
            takeLeft(10),
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
            takeLeft(10),
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
            takeLeft(10),
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
            takeLeft(10),
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
            takeLeft(10),
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
            takeLeft(10),
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
            takeLeft(10),
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
            takeLeft(10),
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

  describe('FoldableWithIndex', () => {
    describe('foldMapWithIndex', () => {
      it('should map elements using their index and fold the resulting list', () => {
        expect(
          pipe(
            prime,
            takeLeft(5),
            foldMapWithIndex(N.MonoidSum)((i, a) => i * a),
          ),
        ).toBe(78)
      })
    })
  })

  describe('Traversable', () => {
    describe('sequence', () => {
      it('should accumulate the results of the effects contained in a list', () => {
        expect(
          pipe(
            prime,
            map(O.some),
            takeLeft(5),
            sequence(O.Applicative),
            O.map(toReadonlyArray),
          ),
        ).toStrictEqual(O.some([2, 3, 5, 7, 11]))
        expect(
          pipe(
            prime,
            map(O.some),
            takeLeft(5),
            append<O.Option<number>>(O.none),
            sequence(O.Applicative),
            O.map(toReadonlyArray),
          ),
        ).toStrictEqual(O.none)
      })
    })
  })

  describe('Witherable', () => {
    describe('wilt', () => {
      it('should split a list applying an effect', () => {
        expect(
          pipe(
            range(0),
            takeLeft(10),
            wilt(O.Applicative)((n) =>
              n >= 10 ? O.none : O.some(0 === n % 3 ? Ei.right(n) : Ei.left(n)),
            ),
            O.map(Se.bimap(toReadonlyArray, toReadonlyArray)),
          ),
        ).toStrictEqual(O.some(Se.separated([1, 2, 4, 5, 7, 8], [0, 3, 6, 9])))
        expect(
          pipe(
            range(0),
            takeLeft(10),
            wilt(O.Applicative)((n) =>
              0 === n % 2
                ? O.none
                : O.some(0 === n % 3 ? Ei.right(n) : Ei.left(n)),
            ),
            O.map(Se.bimap(toReadonlyArray, toReadonlyArray)),
          ),
        ).toStrictEqual(O.none)
      })
    })

    describe('wither', () => {
      it('should filter a list applying an effect', () => {
        expect(
          pipe(
            range(0),
            takeLeft(10),
            wither(O.Applicative)((n) =>
              O.some(0 === n % 2 ? O.none : O.some(n)),
            ),
            O.map(toReadonlyArray),
          ),
        ).toStrictEqual(O.some([1, 3, 5, 7, 9]))
        expect(
          pipe(
            range(0),
            takeLeft(10),
            wither(O.Applicative)((n) =>
              0 === n % 2 ? O.none : O.some(O.some(n)),
            ),
          ),
        ).toStrictEqual(O.none)
      })
    })
  })
})
