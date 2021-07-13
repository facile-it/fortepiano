import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { BufferFromStringC } from './Buffer'

describe('Buffer', () => {
  describe('BufferFromStringC', () => {
    it('should encode buffers into strings', () => {
      const buffer = Buffer.from('foo')

      expect(
        pipe(buffer, BufferFromStringC.encode, BufferFromStringC.decode),
      ).toStrictEqual(E.right(buffer))
    })
  })
})
