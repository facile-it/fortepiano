import * as E from 'fp-ts/Either'
import { constNull, pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { MatrixC, transpose } from './Matrix'

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
          expect(MatrixC(t.number).is(x)).toStrictEqual(isMatrix),
        )
      })
    })
  })

  describe('transpose', () => {
    it('should return the transposition of a matrix', () => {
      matrices.forEach(([a, b]) =>
        expect(
          pipe(a, MatrixC(t.number).decode, E.matchW(constNull, transpose)),
        ).toStrictEqual(b),
      )
    })
    it('should invert the transposition of a matrix', () => {
      matrices.forEach(([a, b]) =>
        expect(
          pipe(b, MatrixC(t.number).decode, E.matchW(constNull, transpose)),
        ).toStrictEqual(a),
      )
    })
  })
})
