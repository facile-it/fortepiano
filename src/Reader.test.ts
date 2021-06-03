import { pick } from './Reader'

describe('Reader', () => {
  describe('pick', () => {
    it('should select only part of the context', () => {
      interface R {
        foo: number
        bar: number
      }

      expect(pick<R>()('foo')({ foo: 42 })).toBe(42)
      expect(pick<R>()('bar')({ bar: 1138 })).toBe(1138)
    })
  })
})
