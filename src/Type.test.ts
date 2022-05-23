import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import * as $Er from './Error'
import * as $RA from './ReadonlyArray'
import { alias, decode, lax, literal, literalUnion, numeric } from './Type'

describe('Type', () => {
  describe('numeric', () => {
    test.each([42, Infinity, NaN, Number.EPSILON, Number.MIN_VALUE])(
      'decoding a number (%d)',
      (value) => {
        expect(numeric.decode(value)).toStrictEqual(E.of(value))
      },
    )
    test.each([42, Infinity, Number.EPSILON, Number.MIN_VALUE])(
      'decoding a non-trimmed numeric string (" %s ")',
      (value) => {
        expect(numeric.decode(` ${value} `)).toStrictEqual(E.of(value))
      },
    )
    test.each(['42foo', '11.38bar', '.1337qux', 'NaN', ''])(
      'failing with a dirty numeric string ("%s")',
      (value) => {
        expect(numeric.decode(value)._tag).toStrictEqual('Left')
      },
    )
  })

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

  describe('lax', () => {
    const partial = t.partial({ foo: t.boolean, bar: t.number, max: t.string })
    const codec = lax(partial.props)
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
            E.getOrElseW(() => null),
          ),
        ).toStrictEqual(output),
      )
    })
  })

  describe('decode', () => {
    test('decoding unsupported input', () => {
      const result = decode(t.union([t.number, numeric]))('foo')
      if (E.isRight(result)) {
        throw new Error()
      }

      expect(result.left.message).toStrictEqual(
        'Cannot decode input with codec "(number | Numeric)"',
      )
      expect(result.left).toBeInstanceOf($Er.AggregateError)
      if (result.left instanceof $Er.AggregateError) {
        expect(result.left.errors).toHaveLength(2)
      }
    })
  })
})
