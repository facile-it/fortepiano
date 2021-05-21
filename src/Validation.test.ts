import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as M from 'fp-ts/Monoid'
import * as S from 'fp-ts/string'
import { getMonoid, Validation } from './Validation'

describe('Validation', () => {
  describe('getMonoid', () => {
    it('should concatenate Left values', () => {
      const a: Validation<string, string> = E.left(['foo'])
      const b: Validation<string, string> = E.left(['bar'])

      expect(
        pipe([a, b], M.concatAll(getMonoid<string>()(S.Monoid))),
      ).toStrictEqual(E.left(['foo', 'bar']))
    })
  })
})
