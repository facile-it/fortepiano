/* eslint-disable no-bitwise */
import { pipe } from 'fp-ts/function'
import * as $binary from './Binary'
import { Binary } from './Binary'
import * as $readonlyArray from './ReadonlyArray'

describe('Binary', () => {
  describe('MonoidAnd', () => {
    const { empty, concat } = $binary.MonoidAnd
    const digits: ReadonlyArray<Binary> = [0, 1]

    it('associativity', () => {
      pipe(digits, $readonlyArray.words(3)).forEach(([a, b, c]) =>
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
      pipe(digits, $readonlyArray.words(2)).forEach(([a, b]) =>
        expect(concat(a, b)).toBe(a & b),
      )
    })
  })

  describe('MonoidOr', () => {
    const { empty, concat } = $binary.MonoidOr
    const digits: ReadonlyArray<Binary> = [0, 1]

    it('associativity', () => {
      pipe(digits, $readonlyArray.words(3)).forEach(([a, b, c]) =>
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
      pipe(digits, $readonlyArray.words(2)).forEach(([a, b]) =>
        expect(concat(a, b)).toBe(a | b),
      )
    })
  })

  describe('MonoidXor', () => {
    const { empty, concat } = $binary.MonoidXor
    const digits: ReadonlyArray<Binary> = [0, 1]

    it('associativity', () => {
      pipe(digits, $readonlyArray.words(3)).forEach(([a, b, c]) =>
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
      pipe(digits, $readonlyArray.words(2)).forEach(([a, b]) =>
        expect(concat(a, b)).toBe(a ^ b),
      )
    })
  })
})
