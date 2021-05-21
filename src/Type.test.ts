import * as t from 'io-ts'
import * as $RA from './ReadonlyArray'
import { alias, literalUnion } from './Type'

describe('Type', () => {
  describe('alias', () => {
    it('should return an equivalent codec with a different name', () => {
      $RA
        .cartesian(
          [t.boolean, t.number, t.string, t.UnknownArray, t.UnknownRecord],
          [true, 1138, 'foo', [], {}],
        )
        .forEach(([codec, a]) => {
          expect(alias('foo', codec).is(a)).toBe(codec.is(a))
          expect(alias('bar', codec).name).toBe('bar')
        })
    })
  })

  describe('literalUnion', () => {
    it('should optimize literal union decoding', () => {
      const number = literalUnion([1138, 1337])
      const string = literalUnion(['foo', 'bar'])

      expect(number.is(1138)).toBe(true)
      expect(number.is(Infinity)).toBe(false)
      expect(string.is('foo')).toBe(true)
      expect(string.is('max')).toBe(false)
    })
  })
})
