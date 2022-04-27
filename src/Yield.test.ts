import { either, number, option, readonlyArray, separated, string } from 'fp-ts'
import { Eq } from 'fp-ts/Eq'
import { flow, pipe } from 'fp-ts/function'
import { Option } from 'fp-ts/Option'
import * as $yield from './Yield'

describe('Yield', () => {
  describe('makeBy', () => {
    it('should create a generator using a function', () => {
      expect(
        pipe(
          $yield.makeBy((i) => Math.sin((i * Math.PI) / 4)),
          $yield.takeLeft(8),
          $yield.toReadonlyArray,
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
      expect(
        pipe($yield.range(0), $yield.takeLeft(5), $yield.toReadonlyArray),
      ).toStrictEqual([0, 1, 2, 3, 4])
      expect(
        pipe($yield.range(1138), $yield.takeLeft(5), $yield.toReadonlyArray),
      ).toStrictEqual([1138, 1139, 1140, 1141, 1142])
    })
    it('should allow starting from a negative number', () => {
      expect(
        pipe($yield.range(-1337), $yield.takeLeft(5), $yield.toReadonlyArray),
      ).toStrictEqual([-1337, -1336, -1335, -1334, -1333])
    })
    it('should allow setting a top boundary', () => {
      expect(pipe($yield.range(0, 9), $yield.toReadonlyArray)).toStrictEqual([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      ])
      expect(pipe($yield.range(42, 49), $yield.toReadonlyArray)).toStrictEqual([
        42, 43, 44, 45, 46, 47, 48, 49,
      ])
    })
    it('should support a top boundary smaller than the bottom one', () => {
      expect(
        pipe($yield.range(42, -Infinity), $yield.toReadonlyArray),
      ).toStrictEqual([42])
    })
  })

  describe('replicate', () => {
    it('should replicate the specified element', () => {
      expect(
        pipe($yield.replicate(42), $yield.takeLeft(5), $yield.toReadonlyArray),
      ).toStrictEqual([42, 42, 42, 42, 42])
    })
  })

  describe('fromReadonlyArray', () => {
    it('should transform an array into a generator', () => {
      expect(
        pipe(
          $yield.fromReadonlyArray([42, 1138, 1337]),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([42, 1138, 1337])
    })
  })

  describe('fromReadonlyRecord', () => {
    it('should transform a record into a generator', () => {
      expect(
        pipe(
          $yield.fromReadonlyRecord({ foo: 42, bar: 1138, max: 1337 }),
          $yield.toReadonlyArray,
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
      expect(
        pipe($yield.prime, $yield.takeLeft(5), $yield.toReadonlyArray),
      ).toStrictEqual([2, 3, 5, 7, 11])
    })
  })

  describe('exp', () => {
    it('should return the exponential function', () => {
      expect(
        pipe($yield.exp, $yield.takeLeft(5), $yield.toReadonlyArray),
      ).toStrictEqual([
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
      expect(
        pipe($yield.fibonacci, $yield.takeLeft(10), $yield.toReadonlyArray),
      ).toStrictEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34])
    })
  })

  describe('flatten', () => {
    it('should flatten nested generators', () => {
      expect(
        pipe(
          $yield.fromReadonlyArray([0, 1, 2]),
          // eslint-disable-next-line fp-ts/prefer-chain
          $yield.map((a) =>
            $yield.fromReadonlyArray([3 * a, 3 * a + 1, 3 * a + 2]),
          ),
          $yield.flatten,
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
    })
  })

  describe('prepend', () => {
    it('should add an element at the top of the list', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.prepend(42),
          $yield.takeLeft(5),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([42, 2, 3, 5, 7])
    })
  })

  describe('append', () => {
    it('should add an element at the bottom of the list', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(5),
          $yield.append(42),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([2, 3, 5, 7, 11, 42])
    })
  })

  describe('takeLeft', () => {
    it('should select only specified elements', () => {
      const x = pipe(
        $yield.range(0),
        $yield.takeLeft(5),
        $yield.toReadonlyArray,
      )

      expect(x).toHaveLength(5)
      expect(x).toStrictEqual([0, 1, 2, 3, 4])
    })
    it('should handle negative numbers', () => {
      const x = pipe(
        $yield.range(0),
        $yield.takeLeft(-Infinity),
        $yield.toReadonlyArray,
      )

      expect(x).toHaveLength(0)
    })
  })

  describe('takeLeftWhile', () => {
    it('should select elements according to a predicate', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeftWhile((n) => n <= 10),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([2, 3, 5, 7])
    })
    it('should handle always false predicates', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeftWhile(() => false),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([])
    })
  })

  describe('dropLeft', () => {
    it('should drop specified elements', () => {
      const x = pipe(
        $yield.range(0),
        $yield.dropLeft(5),
        $yield.takeLeft(5),
        $yield.toReadonlyArray,
      )

      expect(x).toHaveLength(5)
      expect(x).toStrictEqual([5, 6, 7, 8, 9])
    })
    it('should handle negative numbers', () => {
      const x = pipe(
        $yield.range(0),
        $yield.dropLeft(-Infinity),
        $yield.takeLeft(5),
        $yield.toReadonlyArray,
      )

      expect(x).toHaveLength(5)
      expect(x).toStrictEqual([0, 1, 2, 3, 4])
    })
  })

  describe('dropLeftWhile', () => {
    it('should drop elements according to a predicate', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.dropLeftWhile((n) => n < 10),
          $yield.takeLeft(5),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([11, 13, 17, 19, 23])
    })
    it('should handle always false predicates', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.dropLeftWhile(() => false),
          $yield.takeLeft(5),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([2, 3, 5, 7, 11])
    })
  })

  describe('zip', () => {
    it('should zip two lists together', () => {
      expect(
        pipe(
          $yield.range(0),
          $yield.zip($yield.prime),
          $yield.takeLeft(5),
          $yield.toReadonlyArray,
        ),
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
        pipe(
          pipe($yield.range(0), $yield.takeLeft(5)),
          $yield.zip($yield.prime),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([
        [0, 2],
        [1, 3],
        [2, 5],
        [3, 7],
        [4, 11],
      ])
      expect(
        pipe(
          $yield.range(0),
          $yield.zip(pipe($yield.prime, $yield.takeLeft(5))),
          $yield.toReadonlyArray,
        ),
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
        <A>(E: Eq<A>) =>
        (n: number) =>
        (as: ReadonlyArray<A>, a: A): boolean =>
          pipe(
            as,
            readonlyArray.reduce(
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
          $yield.fromReadonlyArray([
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
          $yield.sieve(atMost(string.Eq)(3)),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(['a', 'b', 'a', 'b', 'a', 'b', 'c', 'c', 'c'])
    })
  })

  describe('scanRight', () => {
    it('should return all steps of a reduction', () => {
      expect(
        pipe(
          $yield.range(0),
          $yield.takeLeft(5),
          $yield.scanRight(0, (b, a) => a + b),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([10, 6, 3, 1, 0, 0])
    })
  })

  describe('spanLeft', () => {
    it('should split the list when given condition is not met', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(5),
          $yield.spanLeft((n) => 0 !== n % 5),
          ({ init, rest }) => ({
            init: $yield.toReadonlyArray(init),
            rest: $yield.toReadonlyArray(rest),
          }),
        ),
      ).toStrictEqual({ init: [2, 3], rest: [5, 7, 11] })
    })
  })

  describe('uniq', () => {
    it('should remove repeated elements', () => {
      expect(
        pipe(
          $yield.fromReadonlyArray([
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
          $yield.uniq(string.Eq),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(['a', 'b', 'c'])
    })
  })

  describe('reverse', () => {
    it('should return the inverted list', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(5),
          $yield.reverse,
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([11, 7, 5, 3, 2])
    })
  })

  describe('rights', () => {
    it('should extract Right values', () => {
      expect(
        pipe(
          $yield.fromReadonlyArray([
            either.right(0),
            either.left(1),
            either.right(2),
            either.left(3),
            either.right(4),
          ]),
          $yield.rights,
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([0, 2, 4])
    })
  })

  describe('lefts', () => {
    it('should extract Left values', () => {
      expect(
        pipe(
          $yield.fromReadonlyArray([
            either.right(0),
            either.left(1),
            either.right(2),
            either.left(3),
            either.right(4),
          ]),
          $yield.lefts,
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([1, 3])
    })
  })

  describe('intersperse', () => {
    it('should insert given element between each pair of list elements', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.intersperse(42),
          $yield.takeLeft(5),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([2, 42, 3, 42, 5])
    })
    it('should handle empty lists', () => {
      expect(
        pipe($yield.prime, $yield.takeLeft(0), $yield.toReadonlyArray),
      ).toStrictEqual([])
    })
  })

  describe('rotate', () => {
    it('should rotate the list by given steps', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(5),
          $yield.rotate(2),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([7, 11, 2, 3, 5])
    })
    it('should handle negative numbers', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(5),
          $yield.rotate(-2),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([5, 7, 11, 2, 3])
    })
  })

  describe('chunksOf', () => {
    it('should split the list into chunks of a given size', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(10),
          $yield.chunksOf(3),
          $yield.map($yield.toReadonlyArray),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([[2, 3, 5], [7, 11, 13], [17, 19, 23], [29]])
    })
    it('should force the chunk size to be at least 1', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(5),
          $yield.chunksOf(-Infinity),
          $yield.map($yield.toReadonlyArray),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([[2], [3], [5], [7], [11]])
    })
    it('should handle empty lists', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(0),
          $yield.chunksOf(3),
          $yield.map($yield.toReadonlyArray),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([])
    })
  })

  describe('matchLeft', () => {
    it('should handle empty lists', () => {
      expect(
        pipe(
          $yield.getMonoid().empty,
          $yield.matchLeft(
            () => 'nil',
            (a) => `cons(${a})`,
          ),
        ),
      ).toBe('nil')
    })
    it('should handle non-empty lists', () => {
      expect(
        pipe(
          $yield.range(0),
          $yield.matchLeft(
            () => 'nil',
            (a) => `cons(${a})`,
          ),
        ),
      ).toBe('cons(0)')
    })
    it('should handle lists of one element', () => {
      expect(
        pipe(
          $yield.range(0),
          $yield.takeLeft(1),
          $yield.matchLeft(
            () => 'nil',
            (head, tail) =>
              `cons(${head}), ${pipe(
                tail,
                $yield.matchLeft(
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
          $yield.range(0),
          $yield.matchLeft(
            () => 'nil',
            (head, tail) =>
              `cons(${head}), ${pipe(
                tail,
                $yield.matchLeft(
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
          $yield.prime,
          $yield.takeLeft(0),
          $yield.matchRight(
            () => [],
            (init, last) => [$yield.toReadonlyArray(init), last],
          ),
        ),
      ).toHaveLength(0)
    })
    it('should handle non-empty lists', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(5),
          $yield.matchRight(
            () => [],
            (init, last) => [$yield.toReadonlyArray(init), last],
          ),
        ),
      ).toStrictEqual([[2, 3, 5, 7], 11])
    })
    it('should handle lists of one element', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(1),
          $yield.matchRight(
            () => [],
            (init, last) => [$yield.toReadonlyArray(init), last],
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
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual([42, 1138, 1337])
    })
  })

  describe('tail', () => {
    it('should return all elements but first one', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(5),
          $yield.tail,
          option.map($yield.toReadonlyArray),
        ),
      ).toStrictEqual(option.some([3, 5, 7, 11]))
    })
    it('should fail with empty lists', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(0),
          $yield.tail,
          option.map($yield.toReadonlyArray),
        ),
      ).toStrictEqual(option.none)
    })
  })

  describe('init', () => {
    it('should return all elements but last one', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(5),
          $yield.init,
          option.map($yield.toReadonlyArray),
        ),
      ).toStrictEqual(option.some([2, 3, 5, 7]))
    })
    it('should fail with empty lists', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(0),
          $yield.init,
          option.map($yield.toReadonlyArray),
        ),
      ).toStrictEqual(option.none)
    })
  })

  describe('splitAt', () => {
    it('should split a list at a given position', () => {
      const x = pipe($yield.prime, $yield.takeLeft(10), $yield.splitAt(5))

      expect(pipe(x[0], $yield.toReadonlyArray)).toStrictEqual([2, 3, 5, 7, 11])
      expect(pipe(x[1], $yield.toReadonlyArray)).toStrictEqual([
        13, 17, 19, 23, 29,
      ])
    })
    it('should handle negative indices', () => {
      const x = pipe(
        $yield.prime,
        $yield.takeLeft(5),
        $yield.splitAt(-Infinity),
      )

      expect(pipe(x[0], $yield.toReadonlyArray)).toStrictEqual([])
      expect(pipe(x[1], $yield.toReadonlyArray)).toStrictEqual([2, 3, 5, 7, 11])
    })
    it('should handle out of scale indices', () => {
      const x = pipe($yield.prime, $yield.takeLeft(5), $yield.splitAt(Infinity))

      expect(pipe(x[0], $yield.toReadonlyArray)).toStrictEqual([2, 3, 5, 7, 11])
      expect(pipe(x[1], $yield.toReadonlyArray)).toStrictEqual([])
    })
  })

  describe('unzip', () => {
    it('should restore two zipped lists', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.zip($yield.range(0)),
          $yield.takeLeft(5),
          $yield.unzip,
          ([a, b]) => [$yield.toReadonlyArray(a), $yield.toReadonlyArray(b)],
        ),
      ).toStrictEqual([
        [2, 3, 5, 7, 11],
        [0, 1, 2, 3, 4],
      ])
    })
  })

  describe('isEmpty', () => {
    it('should recognize empty lists', () => {
      expect(pipe($yield.getMonoid().empty, $yield.isEmpty)).toBe(true)
    })
    it('should recognize non-empty lists', () => {
      expect(pipe($yield.range(0), $yield.isEmpty)).toBe(false)
    })
  })

  describe('isNonEmpty', () => {
    it('should recognize empty lists', () => {
      expect(pipe($yield.getMonoid().empty, $yield.isNonEmpty)).toBe(false)
    })
    it('should recognize non-empty lists', () => {
      expect(pipe($yield.range(0), $yield.isNonEmpty)).toBe(true)
    })
  })

  describe('size', () => {
    it('should return list size', () => {
      expect(pipe($yield.prime, $yield.takeLeft(5), $yield.size)).toBe(5)
    })
    it('should handle empty lists', () => {
      expect(pipe($yield.prime, $yield.takeLeft(0), $yield.size)).toBe(0)
    })
  })

  describe('lookup', () => {
    it('should return None when the index is out of bound', () => {
      expect(
        pipe($yield.range(0), $yield.takeLeft(5), $yield.lookup(5)),
      ).toStrictEqual(option.none)
    })
    it('should return Some when the index is in bound', () => {
      expect(
        pipe($yield.range(0), $yield.takeLeft(5), $yield.lookup(4)),
      ).toStrictEqual(option.some(4))
    })
    it('should handle negative numbers', () => {
      expect(pipe($yield.range(0), $yield.lookup(-Infinity))).toStrictEqual(
        option.none,
      )
    })
  })

  describe('head', () => {
    it('should return None with empty lists', () => {
      expect(pipe($yield.getMonoid().empty, $yield.head)).toStrictEqual(
        option.none,
      )
    })
    it('should return Some with non-empty lists', () => {
      expect(pipe($yield.range(0), $yield.head)).toStrictEqual(option.some(0))
    })
  })

  describe('findFirstIndex', () => {
    it('should find first matching element and return its index', () => {
      expect(
        pipe(
          $yield.range(0),
          $yield.takeLeft(5),
          $yield.findFirstIndex((i) => 0 !== i % 2),
        ),
      ).toStrictEqual(option.some(1))
    })
    it('should return None when no element is found', () => {
      expect(
        pipe(
          $yield.range(0),
          $yield.takeLeft(5),
          $yield.findFirstIndex((i) => i >= 5),
        ),
      ).toStrictEqual(option.none)
    })
  })

  describe('findLast', () => {
    it('should return None when no element is found', () => {
      expect(
        pipe(
          $yield.range(0),
          $yield.takeLeft(5),
          $yield.findLast((n) => n >= 5),
        ),
      ).toStrictEqual(option.none)
    })
    it('should return Some when an element is found', () => {
      expect(
        pipe(
          $yield.range(0),
          $yield.takeLeft(5),
          $yield.findLast((n) => n >= 4),
        ),
      ).toStrictEqual(option.some(4))
    })
  })

  describe('findLastMap', () => {
    it('should find last matching element and transform it', () => {
      expect(
        pipe(
          $yield.range(0),
          $yield.takeLeft(5),
          $yield.findLastMap((i) =>
            0 === i % 2
              ? option.none
              : option.some(String.fromCharCode('a'.charCodeAt(0) + i)),
          ),
        ),
      ).toStrictEqual(option.some('d'))
    })
    it('should return None when no element is found', () => {
      expect(
        pipe(
          $yield.range(0),
          $yield.takeLeft(5),
          $yield.findLastMap((i) =>
            i < 5
              ? option.none
              : option.some(String.fromCharCode('a'.charCodeAt(0) + i)),
          ),
        ),
      ).toStrictEqual(option.none)
    })
  })

  describe('findLastIndex', () => {
    it('should find last matching element and return its index', () => {
      expect(
        pipe(
          $yield.range(0),
          $yield.takeLeft(5),
          $yield.findLastIndex((i) => 0 !== i % 2),
        ),
      ).toStrictEqual(option.some(3))
    })
    it('should return None when no element is found', () => {
      expect(
        pipe(
          $yield.range(0),
          $yield.takeLeft(5),
          $yield.findLastIndex((i) => i >= 5),
        ),
      ).toStrictEqual(option.none)
    })
  })

  describe('elem', () => {
    it('should return None when the element is not found', () => {
      expect(
        pipe($yield.range(0), $yield.takeLeft(5), $yield.elem(number.Eq)(5)),
      ).toStrictEqual(option.none)
    })
    it('should return Some when the element is found', () => {
      expect(pipe($yield.range(0), $yield.elem(number.Eq)(4))).toStrictEqual(
        option.some(4),
      )
    })
  })

  describe('insertAt', () => {
    it('should insert an element at a given position', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.insertAt(2, 42),
          option.map(flow($yield.takeLeft(5), $yield.toReadonlyArray)),
        ),
      ).toStrictEqual(option.some([2, 3, 42, 5, 7]))
    })
    it('should handle out of bound indices', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(5),
          $yield.insertAt(Infinity, 42),
          option.map($yield.toReadonlyArray),
        ),
      ).toStrictEqual(option.none)
    })
  })

  describe('updateAt', () => {
    it('should update an element at a given position', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.updateAt(2, 42),
          option.map(flow($yield.takeLeft(5), $yield.toReadonlyArray)),
        ),
      ).toStrictEqual(option.some([2, 3, 42, 7, 11]))
    })
    it('should handle out of bound indices', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(5),
          $yield.updateAt(Infinity, 42),
          option.map($yield.toReadonlyArray),
        ),
      ).toStrictEqual(option.none)
    })
  })

  describe('deleteAt', () => {
    it('should delete an element at a given position', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.deleteAt(2),
          option.map(flow($yield.takeLeft(5), $yield.toReadonlyArray)),
        ),
      ).toStrictEqual(option.some([2, 3, 7, 11, 13]))
    })
    it('should handle out of bound indices', () => {
      expect(
        pipe(
          $yield.prime,
          $yield.takeLeft(5),
          $yield.deleteAt(Infinity),
          option.map($yield.toReadonlyArray),
        ),
      ).toStrictEqual(option.none)
    })
  })

  describe('Monoid', () => {
    const { empty, concat } = $yield.getMonoid<number>()
    const a = $yield.fromReadonlyArray([0, 1, 2])
    const b = $yield.fromReadonlyArray([3, 4, 5])
    const c = $yield.fromReadonlyArray([6, 7, 8])

    it('associativity', () => {
      expect(
        pipe(concat(a, concat(b, c)), $yield.toReadonlyArray),
      ).toStrictEqual(pipe(concat(concat(a, b), c), $yield.toReadonlyArray))
    })
    it('identity', () => {
      expect(pipe(concat(empty, empty), $yield.toReadonlyArray)).toStrictEqual(
        pipe(empty, $yield.toReadonlyArray),
      )
      expect(pipe(concat(a, empty), $yield.toReadonlyArray)).toStrictEqual(
        pipe(a, $yield.toReadonlyArray),
      )
      expect(pipe(concat(empty, a), $yield.toReadonlyArray)).toStrictEqual(
        pipe(a, $yield.toReadonlyArray),
      )
    })

    it('should concatenate generated values', () => {
      expect(
        pipe(concat(a, concat(b, c)), $yield.toReadonlyArray),
      ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
    })
  })

  describe('Eq', () => {
    const { equals } = $yield.getEq<number>(number.Eq)
    const fa = $yield.fromReadonlyArray([0, 1, 2])
    const fb = pipe($yield.range(0), $yield.takeLeft(3))
    const fc = function* () {
      yield 0
      yield 1
      yield 2
    }
    const fd = $yield.fromReadonlyArray([3, 4, 5])

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
    const { equals, compare } = $yield.getOrd<number>(number.Ord)
    const fa = $yield.fromReadonlyArray([0, 1, 2])
    const fb = pipe($yield.range(3), $yield.takeLeft(3))
    const fc = function* () {
      yield 6
      yield 7
      yield 8
    }
    const fd = $yield.fromReadonlyArray([0, 1, 2])

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
    const fa = $yield.fromReadonlyArray([0, 1, 2])

    it('identity', () => {
      expect(
        pipe(
          $yield.Functor.map(fa, (a) => a),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(pipe(fa, $yield.toReadonlyArray))
    })
    it('composition', () => {
      const ab = (a: number) => a + 1
      const bc = (a: number) => a / 2

      expect(
        pipe(
          $yield.Functor.map(fa, (a) => bc(ab(a))),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(
          $yield.Functor.map($yield.Functor.map(fa, ab), bc),
          $yield.toReadonlyArray,
        ),
      )
    })
  })

  describe('FunctorWithIndex', () => {
    const fa = $yield.fromReadonlyArray([0, 1, 2])

    it('identity', () => {
      expect(
        pipe(
          $yield.FunctorWithIndex.mapWithIndex(fa, (_, a) => a),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(pipe(fa, $yield.toReadonlyArray))
    })
    it('composition', () => {
      const ab = (a: number) => a + 1
      const bc = (a: number) => a / 2

      expect(
        pipe(
          $yield.FunctorWithIndex.mapWithIndex(fa, (_, a) => bc(ab(a))),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(
          $yield.FunctorWithIndex.mapWithIndex(
            $yield.FunctorWithIndex.mapWithIndex(fa, (_, a) => ab(a)),
            (_, b) => bc(b),
          ),
          $yield.toReadonlyArray,
        ),
      )
    })
  })

  describe('Apply', () => {
    const fa = $yield.fromReadonlyArray([0, 1, 2])
    const ab = (a: number) => a + 1
    const bc = (a: number) => a / 2

    it('associative composition', () => {
      expect(
        pipe(
          $yield.Apply.ap(
            $yield.Apply.ap(
              $yield.Apply.map(
                $yield.of(bc),
                (bc) => (ab: (a: number) => number) => (a: number) => bc(ab(a)),
              ),
              $yield.of(ab),
            ),
            fa,
          ),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(
          $yield.Apply.ap($yield.of(bc), $yield.Apply.ap($yield.of(ab), fa)),
          $yield.toReadonlyArray,
        ),
      )
    })
  })

  describe('Applicative', () => {
    const a = 42
    const fa = $yield.fromReadonlyArray([0, 1, 2])
    const ab = (a: number) => a + 1

    it('identity', () => {
      expect(
        pipe(
          $yield.Applicative.ap(
            $yield.Applicative.of((a: number) => a),
            fa,
          ),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(pipe(fa, $yield.toReadonlyArray))
    })
    it('homomorphism', () => {
      expect(
        pipe(
          $yield.Applicative.ap(
            $yield.Applicative.of(ab),
            $yield.Applicative.of(a),
          ),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe($yield.Applicative.of(ab(a)), $yield.toReadonlyArray),
      )
    })
    it('interchange', () => {
      expect(
        pipe(
          $yield.Applicative.ap(
            $yield.Applicative.of(ab),
            $yield.Applicative.of(a),
          ),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(
          $yield.Applicative.ap(
            $yield.Applicative.of((ab: (a: number) => number) => ab(a)),
            $yield.Applicative.of(ab),
          ),
          $yield.toReadonlyArray,
        ),
      )
    })
  })

  describe('Chain', () => {
    const fa = $yield.fromReadonlyArray([0, 1, 2])
    const afb = (a: number) => $yield.of(a + 1)
    const bfc = (a: number) => $yield.of(a / 2)

    it('associativity', () => {
      expect(
        pipe(
          $yield.Chain.chain($yield.Chain.chain(fa, afb), bfc),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(
          $yield.Chain.chain(fa, (a) => $yield.Chain.chain(afb(a), bfc)),
          $yield.toReadonlyArray,
        ),
      )
    })
  })

  describe('Monad', () => {
    const a = 42
    const fa = $yield.fromReadonlyArray([0, 1, 2])
    const f = (a: number) => $yield.of(a + 1)

    it('left identity', () => {
      expect(
        pipe($yield.Monad.chain($yield.Monad.of(a), f), $yield.toReadonlyArray),
      ).toStrictEqual(pipe(f(a), $yield.toReadonlyArray))
    })
    it('right identity', () => {
      expect(
        pipe($yield.Monad.chain(fa, $yield.Monad.of), $yield.toReadonlyArray),
      ).toStrictEqual(pipe(fa, $yield.toReadonlyArray))
    })
  })

  describe('FromIO', () => {
    describe('fromIO', () => {
      it('should generate values using an IO', () => {
        const now = Date.now()
        const as = pipe(
          $yield.FromIO.fromIO(() => Date.now()),
          $yield.takeLeft(100),
          $yield.toReadonlyArray,
        )

        expect(as[0]).toBeGreaterThanOrEqual(now)
        expect(as[99]).toBeLessThanOrEqual(Date.now())
      })
    })
  })

  describe('Unfoldable', () => {
    describe('unfold', () => {
      it('should return a list starting from a given value using a function', () => {
        const factors = $yield.unfold((b: number) =>
          pipe(
            $yield.prime,
            $yield.takeLeftWhile((n) => n <= b),
            $yield.dropLeftWhile((n) => 0 !== b % n),
            $yield.head,
            option.map((n) => [n, b / n]),
          ),
        )

        expect(pipe(42, factors, $yield.toReadonlyArray)).toStrictEqual([
          2, 3, 7,
        ])
      })
    })
  })

  describe('Alt', () => {
    const fa = $yield.fromReadonlyArray([0, 1, 2])
    const ga = $yield.fromReadonlyArray([3, 4, 5])
    const ha = $yield.fromReadonlyArray([6, 7, 8])

    it('associativity', () => {
      expect(
        pipe(
          $yield.Alt.alt(
            $yield.Alt.alt(fa, () => ga),
            () => ha,
          ),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(
          $yield.Alt.alt(fa, () => $yield.Alt.alt(ga, () => ha)),
          $yield.toReadonlyArray,
        ),
      )
    })
    it('distributivity', () => {
      const ab = (a: number) => a + 1

      expect(
        pipe(
          $yield.Alt.map(
            $yield.Alt.alt(fa, () => ga),
            ab,
          ),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(
          $yield.Alt.alt($yield.Alt.map(fa, ab), () => $yield.Alt.map(ga, ab)),
          $yield.toReadonlyArray,
        ),
      )
    })
  })

  describe('Alternative', () => {
    const fa = $yield.fromReadonlyArray([0, 1, 2])

    it('left identity', () => {
      expect(
        pipe(
          $yield.Alternative.alt($yield.Alternative.zero(), () => fa),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(pipe(fa, $yield.toReadonlyArray))
    })
    it('right identity', () => {
      expect(
        pipe(
          $yield.Alternative.alt(fa, $yield.Alternative.zero),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(pipe(fa, $yield.toReadonlyArray))
    })
    it('annihilation', () => {
      const f = (a: number) => a + 1

      expect(
        pipe(
          $yield.Alternative.map($yield.Alternative.zero(), f),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(pipe($yield.Alternative.zero(), $yield.toReadonlyArray))
    })
    it('distributivity', () => {
      const fab = $yield.of((a: number) => a + 1)
      const gab = $yield.of((a: number) => a / 2)

      expect(
        pipe(
          $yield.Alternative.ap(
            $yield.Alternative.alt(fab, () => gab),
            fa,
          ),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(
        pipe(
          $yield.Alternative.alt($yield.Alternative.ap(fab, fa), () =>
            $yield.Alternative.ap(gab, fa),
          ),
          $yield.toReadonlyArray,
        ),
      )
    })
    it('annihilation', () => {
      expect(
        pipe(
          $yield.Alternative.ap($yield.Alternative.zero(), fa),
          $yield.toReadonlyArray,
        ),
      ).toStrictEqual(pipe($yield.Alternative.zero(), $yield.toReadonlyArray))
    })
  })

  describe('Extend', () => {
    describe('duplicate', () => {
      it('should duplicate the list on each element', () => {
        expect(
          pipe(
            $yield.prime,
            $yield.takeLeft(5),
            $yield.duplicate,
            $yield.map($yield.toReadonlyArray),
            $yield.toReadonlyArray,
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
            $yield.fromReadonlyArray([
              option.none,
              option.some(0),
              option.none,
              option.some(1),
              option.none,
              option.some(2),
            ]),
            $yield.Compactable.compact,
            $yield.toReadonlyArray,
          ),
        ).toStrictEqual([0, 1, 2])
      })
    })

    describe('separate', () => {
      it('should split Left and Right elements', () => {
        expect(
          pipe(
            $yield.fromReadonlyArray([
              either.left('a'),
              either.right(0),
              either.left('b'),
              either.right(1),
              either.left('c'),
              either.right(2),
            ]),
            $yield.Compactable.separate,
            (as) =>
              separated.separated(
                $yield.toReadonlyArray(as.left),
                $yield.toReadonlyArray(as.right),
              ),
          ),
        ).toStrictEqual(separated.separated(['a', 'b', 'c'], [0, 1, 2]))
      })
    })
  })

  describe('Filterable', () => {
    describe('filter', () => {
      it('should filter elements', () => {
        expect(
          pipe(
            $yield.range(0),
            $yield.takeLeft(10),
            $yield.filter((n) => 0 !== n % 2),
            $yield.toReadonlyArray,
          ),
        ).toStrictEqual([1, 3, 5, 7, 9])
      })
    })

    describe('filterMap', () => {
      it('should filter and transform elements', () => {
        expect(
          pipe(
            $yield.range(0),
            $yield.takeLeft(10),
            $yield.filterMap((n) =>
              0 !== n % 2 ? option.some(2 * n) : option.none,
            ),
            $yield.toReadonlyArray,
          ),
        ).toStrictEqual([2, 6, 10, 14, 18])
      })
    })

    describe('partition', () => {
      it('should split elements', () => {
        expect(
          pipe(
            $yield.range(0),
            $yield.takeLeft(10),
            $yield.partition((n) => 0 !== n % 2),
            (as) =>
              separated.separated(
                $yield.toReadonlyArray(as.left),
                $yield.toReadonlyArray(as.right),
              ),
          ),
        ).toStrictEqual(separated.separated([0, 2, 4, 6, 8], [1, 3, 5, 7, 9]))
      })
    })

    describe('partitionMap', () => {
      it('should split and transform elements', () => {
        expect(
          pipe(
            $yield.range(0),
            $yield.takeLeft(10),
            $yield.partitionMap((n) =>
              0 !== n % 2 ? either.right(2 * n) : either.left(-2 * n),
            ),
            (as) =>
              separated.separated(
                $yield.toReadonlyArray(as.left),
                $yield.toReadonlyArray(as.right),
              ),
          ),
        ).toStrictEqual(
          separated.separated([-0, -4, -8, -12, -16], [2, 6, 10, 14, 18]),
        )
      })
    })
  })

  describe('FilterableWithIndex', () => {
    describe('filterWithIndex', () => {
      it('should filter elements using their index', () => {
        expect(
          pipe(
            $yield.range(0),
            $yield.takeLeft(10),
            $yield.filterWithIndex((i, n) => i < 5 && 0 !== n % 2),
            $yield.toReadonlyArray,
          ),
        ).toStrictEqual([1, 3])
      })
    })

    describe('filterMapWithIndex', () => {
      it('should filter and transform elements using their index', () => {
        expect(
          pipe(
            $yield.range(0),
            $yield.takeLeft(10),
            $yield.filterMapWithIndex((i, n) =>
              i < 5 && 0 !== n % 2 ? option.some(2 * n) : option.none,
            ),
            $yield.toReadonlyArray,
          ),
        ).toStrictEqual([2, 6])
      })
    })

    describe('partitionWithIndex', () => {
      it('should split elements using their index', () => {
        expect(
          pipe(
            $yield.range(0),
            $yield.takeLeft(10),
            $yield.partitionWithIndex((i, n) => i < 5 && 0 !== n % 2),
            (as) =>
              separated.separated(
                $yield.toReadonlyArray(as.left),
                $yield.toReadonlyArray(as.right),
              ),
          ),
        ).toStrictEqual(separated.separated([0, 2, 4, 5, 6, 7, 8, 9], [1, 3]))
      })
    })

    describe('partitionMapWithIndex', () => {
      it('should split and transform elements using their index', () => {
        expect(
          pipe(
            $yield.range(0),
            $yield.takeLeft(10),
            $yield.partitionMapWithIndex((i, n) =>
              i < 5 && 0 !== n % 2 ? either.right(2 * n) : either.left(-2 * n),
            ),
            (as) =>
              separated.separated(
                $yield.toReadonlyArray(as.left),
                $yield.toReadonlyArray(as.right),
              ),
          ),
        ).toStrictEqual(
          separated.separated([-0, -4, -8, -10, -12, -14, -16, -18], [2, 6]),
        )
      })
    })
  })

  describe('FoldableWithIndex', () => {
    describe('foldMapWithIndex', () => {
      it('should map elements using their index and fold the resulting list', () => {
        expect(
          pipe(
            $yield.prime,
            $yield.takeLeft(5),
            $yield.foldMapWithIndex(number.MonoidSum)((i, a) => i * a),
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
            $yield.prime,
            $yield.map(option.some),
            $yield.takeLeft(5),
            $yield.sequence(option.Applicative),
            option.map($yield.toReadonlyArray),
          ),
        ).toStrictEqual(option.some([2, 3, 5, 7, 11]))
        expect(
          pipe(
            $yield.prime,
            $yield.map(option.some),
            $yield.takeLeft(5),
            $yield.append<Option<number>>(option.none),
            $yield.sequence(option.Applicative),
            option.map($yield.toReadonlyArray),
          ),
        ).toStrictEqual(option.none)
      })
    })
  })

  describe('Witherable', () => {
    describe('wilt', () => {
      it('should split a list applying an effect', () => {
        expect(
          pipe(
            $yield.range(0),
            $yield.takeLeft(10),
            $yield.wilt(option.Applicative)((n) =>
              n >= 10
                ? option.none
                : option.some(0 === n % 3 ? either.right(n) : either.left(n)),
            ),
            option.map(
              separated.bimap($yield.toReadonlyArray, $yield.toReadonlyArray),
            ),
          ),
        ).toStrictEqual(
          option.some(separated.separated([1, 2, 4, 5, 7, 8], [0, 3, 6, 9])),
        )
        expect(
          pipe(
            $yield.range(0),
            $yield.takeLeft(10),
            $yield.wilt(option.Applicative)((n) =>
              0 === n % 2
                ? option.none
                : option.some(0 === n % 3 ? either.right(n) : either.left(n)),
            ),
            option.map(
              separated.bimap($yield.toReadonlyArray, $yield.toReadonlyArray),
            ),
          ),
        ).toStrictEqual(option.none)
      })
    })

    describe('wither', () => {
      it('should filter a list applying an effect', () => {
        expect(
          pipe(
            $yield.range(0),
            $yield.takeLeft(10),
            $yield.wither(option.Applicative)((n) =>
              option.some(0 === n % 2 ? option.none : option.some(n)),
            ),
            option.map($yield.toReadonlyArray),
          ),
        ).toStrictEqual(option.some([1, 3, 5, 7, 9]))
        expect(
          pipe(
            $yield.range(0),
            $yield.takeLeft(10),
            $yield.wither(option.Applicative)((n) =>
              0 === n % 2 ? option.none : option.some(option.some(n)),
            ),
          ),
        ).toStrictEqual(option.none)
      })
    })
  })
})
