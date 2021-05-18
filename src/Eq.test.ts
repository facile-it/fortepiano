import { eq } from './Eq'

describe('Eq', () => {
  describe('eqType', () => {
    describe('equals', () => {
      it('should return false with values of different types', () => {
        expect(eq.eqType.equals(true, 1138)).toBe(false)
        expect(eq.eqType.equals(1138, 'foo')).toBe(false)
        expect(eq.eqType.equals(true, 'foo')).toBe(false)
      })
      it('should return true with values of the same type', () => {
        expect(eq.eqType.equals(true, false)).toBe(true)
        expect(eq.eqType.equals(1138, 1337)).toBe(true)
        expect(eq.eqType.equals('foo', 'bar')).toBe(true)
      })
    })
  })
})
