import * as E from 'fp-ts/Either'
import { pick } from './ReaderEither'

describe('ReaderEither', () => {
  describe('pick', () => {
    it('should select only part of the context', () => {
      interface R {
        foo: number
        bar: number
      }

      expect(pick<R>()('foo')({ foo: 42 })).toStrictEqual(E.right(42))
      expect(pick<R>()('bar')({ bar: 1138 })).toStrictEqual(E.right(1138))
    })
  })
})
