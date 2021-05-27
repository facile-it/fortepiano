import * as RA from 'fp-ts/ReadonlyArray'
import { eqType, getEqSize } from './Eq'

describe('Eq', () => {
  describe('eqType', () => {
    describe('equals', () => {
      it('should return false with values of different types', () => {
        expect(eqType.equals(true, 1138)).toBe(false)
        expect(eqType.equals(1138, 'foo')).toBe(false)
        expect(eqType.equals(true, 'foo')).toBe(false)
      })
      it('should return true with values of the same type', () => {
        expect(eqType.equals(true, false)).toBe(true)
        expect(eqType.equals(1138, 1337)).toBe(true)
        expect(eqType.equals('foo', 'bar')).toBe(true)
      })
    })
  })

  describe('getEqSize', () => {
    describe('equals', () => {
      it('should compare two arrays only by their size', () => {
        expect(getEqSize(RA).equals([], [])).toBe(true)
        expect(getEqSize(RA).equals([0], [])).toBe(false)
        expect(getEqSize(RA).equals([], [0])).toBe(false)
        expect(getEqSize(RA).equals([0], [0, 1])).toBe(false)
        expect(getEqSize(RA).equals([0, 1, 2], [0, 1, 2])).toBe(true)
        expect(getEqSize(RA).equals([0, 1, 2], ['a', 'b', 'c'])).toBe(true)
        // eslint-disable-next-line no-sparse-arrays
        expect(getEqSize(RA).equals([0, 1, 2], [, , ,])).toBe(true)
      })
    })
  })
})
