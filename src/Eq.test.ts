import { readonlyArray } from 'fp-ts'
import * as $eq from './Eq'

describe('Eq', () => {
  describe('eqType', () => {
    describe('equals', () => {
      it('should return false with values of different types', () => {
        expect($eq.eqType.equals(true, 1138)).toBe(false)
        expect($eq.eqType.equals(1138, 'foo')).toBe(false)
        expect($eq.eqType.equals(true, 'foo')).toBe(false)
      })
      it('should return true with values of the same type', () => {
        expect($eq.eqType.equals(true, false)).toBe(true)
        expect($eq.eqType.equals(1138, 1337)).toBe(true)
        expect($eq.eqType.equals('foo', 'bar')).toBe(true)
      })
    })
  })

  describe('getEqSize', () => {
    describe('equals', () => {
      it('should compare two arrays only by their size', () => {
        expect($eq.getEqSize(readonlyArray).equals([], [])).toBe(true)
        expect($eq.getEqSize(readonlyArray).equals([0], [])).toBe(false)
        expect($eq.getEqSize(readonlyArray).equals([], [0])).toBe(false)
        expect($eq.getEqSize(readonlyArray).equals([0], [0, 1])).toBe(false)
        expect($eq.getEqSize(readonlyArray).equals([0, 1, 2], [0, 1, 2])).toBe(
          true,
        )
        expect(
          $eq.getEqSize(readonlyArray).equals([0, 1, 2], ['a', 'b', 'c']),
        ).toBe(true)
        // eslint-disable-next-line no-sparse-arrays
        expect($eq.getEqSize(readonlyArray).equals([0, 1, 2], [, , ,])).toBe(
          true,
        )
      })
    })
  })
})
