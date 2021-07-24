import * as Ei from 'fp-ts/Either'
import * as Eq from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as TE from 'fp-ts/TaskEither'
import { hash, uuid4 } from './Crypto'
import * as $S from './string'

describe('Crypto', () => {
  describe('hash', () => {
    it('should generate unique hashes', async () => {
      const a = await hash(16)()
      const b = await hash(16)()

      expect(Ei.isRight(a)).toBe(true)
      expect(Ei.isRight(b)).toBe(true)
      expect(Ei.getEq(Eq.eqStrict, S.Eq).equals(a, b)).toBe(false)
    })
  })
  describe('uuid4', () => {
    it('should generate a valid UUID v4', async () => {
      await expect(
        pipe(
          uuid4,
          TE.map(
            $S.test(
              /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
            ),
          ),
        )(),
      ).resolves.toStrictEqual(Ei.of(true))
    })
  })
})
