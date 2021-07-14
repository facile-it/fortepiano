import * as E from 'fp-ts/Either'
import { identity } from 'fp-ts/function'
import { tryCatch } from './TaskEither'

describe('TaskEither', () => {
  describe('tryCatch', () => {
    it('should return a Right when the promise resolves', async () => {
      await expect(
        tryCatch(() => Promise.resolve(42), identity)(),
      ).resolves.toStrictEqual(E.right(42))
    })
    it('should return a Left when the promise rejects', async () => {
      await expect(
        tryCatch(() => Promise.reject(42), identity)(),
      ).resolves.toStrictEqual(E.left(42))
    })
    it('should return a Left when the function throws', async () => {
      await expect(
        tryCatch(() => {
          throw 42
        }, identity)(),
      ).resolves.toStrictEqual(E.left(42))
    })
  })
})
