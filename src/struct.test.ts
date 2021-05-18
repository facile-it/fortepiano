import { pipe } from 'fp-ts/lib/function'
import { struct } from './struct'

describe('struct', () => {
  describe('toReadonlyArray', () => {
    it('should return a list of key-value tuples', () => {
      expect(
        pipe(
          { a: true, b: 1138, c: 'foo', d: undefined },
          struct.toReadonlyArray
        )
      ).toStrictEqual([
        ['a', true],
        ['b', 1138],
        ['c', 'foo'],
        ['d', undefined],
      ])
    })
  })

  describe('filterDeep', () => {
    it('should filter struct values at any depth', () => {
      expect(
        pipe(
          {
            a: true,
            b: { c: undefined, d: { e: 1138, f: { g: 'foo', h: undefined } } },
          },
          struct.filterDeep((x) => undefined !== x && 'number' !== typeof x)
        )
      ).toStrictEqual({ a: true, b: { d: { f: { g: 'foo' } } } })
    })
  })

  describe('patch', () => {
    it('should deep merge two structs', () => {
      expect(
        pipe(
          { a: true, b: { d: { e: 'foo', f: { g: undefined } } } },
          struct.patch({
            b: { c: 1138, d: { f: undefined, h: { i: undefined } } },
          })
        )
      ).toStrictEqual({
        a: true,
        b: { c: 1138, d: { e: 'foo', f: undefined, h: { i: undefined } } },
      })
    })
  })
})
