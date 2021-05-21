import { pipe } from 'fp-ts/function'
import { Binary, MonoidOr } from './Binary'
import * as $RA from './ReadonlyArray'

describe('Binary', () => {
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
        // eslint-disable-next-line no-bitwise
        expect(concat(a, b)).toBe(a | b),
      )
    })
  })
})
