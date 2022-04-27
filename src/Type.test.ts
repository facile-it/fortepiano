import { either } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import * as $readonlyArray from './ReadonlyArray'
import * as $type from './Type'

describe('Type', () => {
  describe('numeric', () => {
    test.each([42, Infinity, NaN, Number.EPSILON, Number.MIN_VALUE])(
      'decoding a number (%d)',
      (value) => {
        expect($type.numeric.decode(value)).toStrictEqual(either.of(value))
      },
    )
    test.each([42, Infinity, Number.EPSILON, Number.MIN_VALUE])(
      'decoding a non-trimmed numeric string (" %s ")',
      (value) => {
        expect($type.numeric.decode(` ${value} `)).toStrictEqual(
          either.of(value),
        )
      },
    )
    test.each(['42foo', '11.38bar', '.1337qux', 'NaN', ''])(
      'failing with a dirty numeric string ("%s")',
      (value) => {
        expect($type.numeric.decode(value)._tag).toStrictEqual('Left')
      },
    )
  })

  describe('literal', () => {
    it('should work with literal values', () => {
      expect($type.literal(42).is(1138)).toBe(false)
      expect($type.literal(42).is(42)).toBe(true)
      expect($type.literal('foo').is('bar')).toBe(false)
      expect($type.literal('foo').is('foo')).toBe(true)
    })
    it('should work with regular expressions', () => {
      expect($type.literal(/foo/).is('bar')).toBe(false)
      expect($type.literal(/foo/).is('foobar')).toBe(true)
    })
  })

  describe('alias', () => {
    it('should return an equivalent codec with a different name', () => {
      $readonlyArray
        .cartesian(
          [t.boolean, t.number, t.string, t.UnknownArray, t.UnknownRecord],
          [true, 1138, 'foo', [], {}],
        )
        .forEach(([codec, a]) => {
          expect($type.alias('foo', codec).is(a)).toBe(codec.is(a))
          expect($type.alias('bar', codec).name).toBe('bar')
        })
    })
  })

  describe('literalUnion', () => {
    it('should optimize literal union decoding', () => {
      const number = $type.literalUnion([1138, 1337])
      const string = $type.literalUnion(['foo', 'bar'])

      expect(number.is(1138)).toBe(true)
      expect(number.is(Infinity)).toBe(false)
      expect(string.is('foo')).toBe(true)
      expect(string.is('max')).toBe(false)
    })
  })

  describe('lax', () => {
    const partial = t.partial({ foo: t.boolean, bar: t.number, max: t.string })
    const codec = $type.lax(partial.props)
    const data = [
      [42, null],
      [{}, {}],
      [{ foo: 42 }, {}],
      [{ foo: true }, { foo: true }],
      [
        { foo: true, bar: 42, max: 'foo' },
        { foo: true, bar: 42, max: 'foo' },
      ],
      [
        { foo: true, bar: null, mad: 'bar', max: 'foo' },
        {
          foo: true,
          // mad: 'bar',
          max: 'foo',
        },
      ],
    ]

    it('should wrap some PartialC functionality', () => {
      data.forEach(([u]) => expect(codec.is(u)).toBe(partial.is(u)))
    })
    it('should strip non-validated properties', () => {
      data.forEach(([u, output]) =>
        expect(
          pipe(
            codec.decode(u),
            either.getOrElseW(() => null),
          ),
        ).toStrictEqual(output),
      )
    })
  })
})
