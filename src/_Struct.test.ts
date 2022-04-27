import { Endomorphism } from 'fp-ts/Endomorphism'
import { flow, increment, pipe } from 'fp-ts/function'
import { Predicate } from 'fp-ts/Predicate'
import * as $struct from './_Struct'

describe('Struct', () => {
  describe('toReadonlyArray', () => {
    it('should return a list of key-value tuples', () => {
      expect(
        pipe(
          { a: true, b: 1138, c: 'foo', d: undefined },
          $struct.toReadonlyArray,
        ),
      ).toStrictEqual([
        ['a', true],
        ['b', 1138],
        ['c', 'foo'],
        ['d', undefined],
      ])
    })
  })

  describe('lookup', () => {
    it('should return the element at given key', () => {
      interface User {
        name: string
        age: number
      }
      const gte =
        (m: number) =>
        (n: number): boolean =>
          n >= m
      const adult: Predicate<User> = flow($struct.lookup('age'), gte(18))

      expect(pipe({ a: true, b: 1138, c: 'foo' }, $struct.lookup('b'))).toBe(
        1138,
      )
      expect(adult({ name: 'Scott', age: 7 })).toBe(false)
      expect(adult({ name: 'Jonathan', age: 33 })).toBe(true)
    })
  })

  describe('modifyAt', () => {
    it('should modify the element at given key using provided function', () => {
      interface User {
        name: string
        age: number
      }
      const birthday: Endomorphism<User> = $struct.modifyAt('age', increment)

      expect(
        pipe(
          { a: true, b: 1138, c: 'foo' },
          $struct.modifyAt('b', (n) => n + 199),
        ),
      ).toStrictEqual({ a: true, b: 1337, c: 'foo' })
      expect(pipe({ name: 'Jonathan', age: 33 }, birthday)).toStrictEqual({
        name: 'Jonathan',
        age: 34,
      })
    })
  })

  describe('updateAt', () => {
    it('should replace the element at given key', () => {
      interface User {
        name: string
        status: 'Employed' | 'Unemployed'
      }
      const fire: Endomorphism<User> = $struct.updateAt('status', 'Unemployed')

      expect(
        pipe({ a: true, b: 1138, c: 'foo' }, $struct.updateAt('b', 1337)),
      ).toStrictEqual({ a: true, b: 1337, c: 'foo' })
      expect(fire({ name: 'Thomas', status: 'Employed' })).toStrictEqual({
        name: 'Thomas',
        status: 'Unemployed',
      })
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
          $struct.filterDeep((x) => undefined !== x && 'number' !== typeof x),
        ),
      ).toStrictEqual({ a: true, b: { d: { f: { g: 'foo' } } } })
    })
  })

  describe('patch', () => {
    it('should deep merge two structs', () => {
      expect(
        pipe(
          { a: true, b: { d: { e: 'foo', f: { g: undefined } } } },
          $struct.patch({
            b: { c: 1138, d: { f: undefined, h: { i: undefined } } },
          }),
        ),
      ).toStrictEqual({
        a: true,
        b: { c: 1138, d: { e: 'foo', f: undefined, h: { i: undefined } } },
      })
    })
  })
})
