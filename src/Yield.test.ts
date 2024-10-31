import * as Ei from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as Se from 'fp-ts/Separated'
import {
  Compactable,
  flatten,
  FromIO,
  fromReadonlyArray,
  Functor,
  FunctorWithIndex,
  makeBy,
  map,
  range,
  takeLeft,
  toReadonlyArray,
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

  describe('fromReadonlyArray', () => {
    it('should transform an array into a generator', () => {
      expect(
        pipe(fromReadonlyArray([42, 1138, 1337]), toReadonlyArray),
      ).toStrictEqual([42, 1138, 1337])
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
})
