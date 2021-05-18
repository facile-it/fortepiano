import { matrix, MatrixC } from './Matrix'
import * as t from 'io-ts'
import { constNull, pipe } from 'fp-ts/lib/function'
import { either } from 'fp-ts'

const arrays = [
  [[], true],
  [[[]], false],
  [[[0, 1, 2]], true],
  [[[0, 1], [2]], false],
  [[[0], [1], [2]], true],
  [
    [
      [0, 1, 2],
      [3, 4, 5],
    ],
    true,
  ],
]

const matrices = [
  [[], []],
  [[[0, 1, 2]], [[0], [1], [2]]],
  [
    [
      [0, 1, 2],
      [3, 4, 5],
    ],
    [
      [0, 3],
      [1, 4],
      [2, 5],
    ],
  ],
  [
    [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ],
    [
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ],
  ],
]

describe('Matrix', () => {
  describe('MatrixC', () => {
    describe('is', () => {
      it('should refine two-dimensional arrays into matrices', () => {
        arrays.forEach(([x, isMatrix]) =>
          expect(MatrixC(t.number).is(x)).toStrictEqual(isMatrix)
        )
      })
    })
  })

  describe('transpose', () => {
    it('should return the transposition of a matrix', () => {
      matrices.forEach(([a, b]) =>
        expect(
          pipe(
            a,
            MatrixC(t.number).decode,
            either.matchW(constNull, matrix.transpose)
          )
        ).toStrictEqual(b)
      )
    })
    it('should invert the transposition of a matrix', () => {
      matrices.forEach(([a, b]) =>
        expect(
          pipe(
            b,
            MatrixC(t.number).decode,
            either.matchW(constNull, matrix.transpose)
          )
        ).toStrictEqual(a)
      )
    })
  })
})
