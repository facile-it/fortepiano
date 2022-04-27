import { either, eq, string, taskEither } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import * as $crypto from './Crypto'
import * as $string from './string'

describe('Crypto', () => {
  describe('hash', () => {
    it('should generate unique hashes', async () => {
      const a = await $crypto.hash(16)()
      const b = await $crypto.hash(16)()

      expect(either.isRight(a)).toBe(true)
      expect(either.isRight(b)).toBe(true)
      expect(either.getEq(eq.eqStrict, string.Eq).equals(a, b)).toBe(false)
    })
  })
  describe('uuid4', () => {
    it('should generate a valid UUID v4', async () => {
      await expect(
        pipe(
          $crypto.uuid4,
          taskEither.map(
            $string.test(
              /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
            ),
          ),
        )(),
      ).resolves.toStrictEqual(either.of(true))
    })
  })
})
