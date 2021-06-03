import { pick } from './ReaderTask'

describe('ReaderTask', () => {
  describe('pick', () => {
    it('should select only part of the context', async () => {
      interface R {
        foo: number
        bar: number
      }

      await expect(pick<R>()('foo')({ foo: 42 })()).resolves.toBe(42)
      await expect(pick<R>()('bar')({ bar: 1138 })()).resolves.toBe(1138)
    })
  })
})
