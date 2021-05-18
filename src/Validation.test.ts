import { either, monoid, string } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { validation, Validation } from './Validation'

describe('Validation', () => {
  describe('getMonoid', () => {
    it('should concatenate Left values', () => {
      const a: Validation<string, string> = either.left(['foo'])
      const b: Validation<string, string> = either.left(['bar'])

      expect(
        pipe(
          [a, b],
          monoid.concatAll(validation.getMonoid<string>()(string.Monoid))
        )
      ).toStrictEqual(either.left(['foo', 'bar']))
    })
  })
})
