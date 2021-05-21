import { eqType } from './Eq'

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
})
