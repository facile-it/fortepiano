import { either } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { BufferFromStringC } from './Buffer'

describe('Buffer', () => {
  describe('BufferFromStringC', () => {
    it('should encode buffers into strings', () => {
      const buffer = Buffer.from('foo')

      expect(
        pipe(buffer, BufferFromStringC.encode, BufferFromStringC.decode),
      ).toStrictEqual(either.right(buffer))
    })
  })
})
