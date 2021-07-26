import { pipe } from 'fp-ts/function'
import { fromUnknown } from './Error'

describe('Error', () => {
  describe('fromUnknown', () => {
    it('should let Error objects through', () => {
      expect(pipe(Error('foo'), fromUnknown(Error('bar'))).message).toBe('foo')
    })
    it('should wrap strings into Error objects', () => {
      expect(pipe('foo', fromUnknown(Error('bar'))).message).toBe('foo')
    })
    it('should discard other values and return default Error object', () => {
      expect(pipe(1138, fromUnknown(Error('bar'))).message).toBe('bar')
    })
  })
})
