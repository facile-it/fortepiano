import { either } from 'fp-ts'
import { identity } from 'fp-ts/function'
import * as $taskEither from './TaskEither'

describe('TaskEither', () => {
  describe('tryCatch', () => {
    it('should return a Right when the promise resolves', async () => {
      await expect(
        $taskEither.tryCatch(() => Promise.resolve(42), identity)(),
      ).resolves.toStrictEqual(either.right(42))
    })
    it('should return a Left when the promise rejects', async () => {
      await expect(
        $taskEither.tryCatch(() => Promise.reject(42), identity)(),
      ).resolves.toStrictEqual(either.left(42))
    })
    it('should return a Left when the function throws', async () => {
      await expect(
        $taskEither.tryCatch(() => {
          throw 42
        }, identity)(),
      ).resolves.toStrictEqual(either.left(42))
    })
  })
})
