import * as t from 'io-ts'
import * as $RA from './ReadonlyArray'
import { alias, literal, literalUnion } from './Type'

describe('Type', () => {
  describe('literal', () => {
    it('should work with literal values', () => {
      expect(literal(42).is(1138)).toBe(false)
      expect(literal(42).is(42)).toBe(true)
      expect(literal('foo').is('bar')).toBe(false)
      expect(literal('foo').is('foo')).toBe(true)
    })
    it('should work with regular expressions', () => {
      expect(literal(/foo/).is('bar')).toBe(false)
      expect(literal(/foo/).is('foobar')).toBe(true)
    })
  })

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
