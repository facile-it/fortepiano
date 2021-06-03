import * as E from 'fp-ts/Either'
import { pick } from './ReaderTaskEither'

describe('ReaderTaskEither', () => {
  describe('pick', () => {
    it('should select only part of the context', async () => {
      interface R {
        foo: number
        bar: number
      }

      await expect(pick<R>()('foo')({ foo: 42 })()).resolves.toStrictEqual(
        E.right(42),
      )
      await expect(pick<R>()('bar')({ bar: 1138 })()).resolves.toStrictEqual(
        E.right(1138),
      )
    })
  })
})
