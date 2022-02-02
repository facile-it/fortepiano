import { ceil, floor, round } from './number'

// Successfully tested with `INTEGERS` equal to 1000.
const INTEGERS = 10
const DIGITS = 3

describe('number', () => {
  describe('round', () => {
    it('should return the same number when an integer is provided', () => {
      for (let a = 0; a < 100; a++) {
        expect(round(1)(a)).toBe(a)
      }
    })
    it('should work with negative numbers', () => {
      for (let number = 0; number < 100; number++) {
        expect(round(1)(-number)).toBe(-number)
      }
      expect(round(1)(-1.111)).toBe(-1.1)
      expect(round(1)(-1.999)).toBe(-2)
    })
    describe('given number with 7+ "0" digits', () => {
      it('should round to a specific digit', () => {
        expect(round(2)(0.000000123)).toBe(0.0)
      })
    })
    describe('given `n` digits', () => {
      it("shouldn't affect numbers with `n` significant digits", () => {
        for (let integer = 0; integer < INTEGERS; integer++) {
          for (let digits = 1; digits <= DIGITS; digits++) {
            for (let decimal = 0; decimal < Math.pow(10, digits); decimal++) {
              const number = Number(
                `${integer}.${`00${decimal}`.slice(-digits)}`,
              )
              expect(round(digits)(number)).toBe(number)
              expect(round(digits)(-number)).toBe(-number)
            }
          }
        }
      })
    })
    it('should round to a specific digit', () => {
      expect(round(2)(1.005)).toBe(1.01)
      expect(round(2)(1.111)).toBe(1.11)
      expect(round(2)(1.119)).toBe(1.12)
      expect(round(2)(1.9)).toBe(1.9)
      expect(round(2)(1.9999999)).toBe(2)
      expect(round(2)(1.00000009999)).toBe(1)
      expect(round(2)(1.0090009999)).toBe(1.01)
      expect(round(0)(1.111)).toBe(1)
      expect(round(0)(1.119)).toBe(1)
      expect(round(0)(1.9)).toBe(2)
    })
  })
  describe('floor', () => {
    it('should round to a specific digit', () => {
      expect(floor(2)(1.111)).toBe(1.11)
      expect(floor(2)(1.119)).toBe(1.11)
      expect(floor(2)(1.9)).toBe(1.9)
      expect(floor(2)(1.9999999)).toBe(1.99)
      expect(floor(2)(1.00000009999)).toBe(1)
      expect(floor(2)(1.0090009999)).toBe(1.0)
      expect(floor(0)(1.111)).toBe(1)
      expect(floor(0)(1.119)).toBe(1)
      expect(floor(0)(1.9)).toBe(1)
    })
  })
  describe('ceil', () => {
    it('should round to a specific digit', () => {
      expect(ceil(2)(1.111)).toBe(1.12)
      expect(ceil(2)(1.119)).toBe(1.12)
      expect(ceil(2)(1.9)).toBe(1.9)
      expect(ceil(2)(1.9999999)).toBe(2)
      expect(ceil(2)(1.00000009999)).toBe(1.01)
      expect(ceil(2)(1.0090009999)).toBe(1.01)
      expect(ceil(0)(1.111)).toBe(2)
      expect(ceil(0)(1.119)).toBe(2)
      expect(ceil(0)(1.9)).toBe(2)
    })
  })
})
