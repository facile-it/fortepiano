/* eslint-disable no-bitwise */
import { pipe } from 'fp-ts/function'
import { Binary, MonoidAnd, MonoidOr, MonoidXor } from './Binary'
import * as $RA from './ReadonlyArray'

describe('Binary', () => {
  describe('MonoidAnd', () => {
    const { empty, concat } = MonoidAnd
    const digits: ReadonlyArray<Binary> = [0, 1]

    it('associativity', () => {
      pipe(digits, $RA.words(3)).forEach(([a, b, c]) =>
        expect(concat(a, concat(b, c))).toBe(concat(concat(a, b), c)),
      )
    })
    it('identity', () => {
      expect(concat(empty, empty)).toBe(empty)
      for (const a of digits) {
        expect(concat(a, empty)).toBe(a)
        expect(concat(empty, a)).toBe(a)
      }
    })
    it('should implement binary AND logic', () => {
      pipe(digits, $RA.words(2)).forEach(([a, b]) =>
        expect(concat(a, b)).toBe(a & b),
      )
    })
  })

  describe('MonoidOr', () => {
    const { empty, concat } = MonoidOr
    const digits: ReadonlyArray<Binary> = [0, 1]

    it('associativity', () => {
      pipe(digits, $RA.words(3)).forEach(([a, b, c]) =>
        expect(concat(a, concat(b, c))).toBe(concat(concat(a, b), c)),
      )
    })
    it('identity', () => {
      expect(concat(empty, empty)).toBe(empty)
      for (const a of digits) {
        expect(concat(a, empty)).toBe(a)
        expect(concat(empty, a)).toBe(a)
      }
    })
    it('should implement binary OR logic', () => {
      pipe(digits, $RA.words(2)).forEach(([a, b]) =>
        expect(concat(a, b)).toBe(a | b),
      )
    })
  })

  describe('MonoidXor', () => {
    const { empty, concat } = MonoidXor
    const digits: ReadonlyArray<Binary> = [0, 1]

    it('associativity', () => {
      pipe(digits, $RA.words(3)).forEach(([a, b, c]) =>
        expect(concat(a, concat(b, c))).toBe(concat(concat(a, b), c)),
      )
    })
    it('identity', () => {
      expect(concat(empty, empty)).toBe(empty)
      for (const a of digits) {
        expect(concat(a, empty)).toBe(a)
        expect(concat(empty, a)).toBe(a)
      }
    })
    it('should implement binary XOR logic', () => {
      pipe(digits, $RA.words(2)).forEach(([a, b]) =>
        expect(concat(a, b)).toBe(a ^ b),
      )
    })
  })
})
