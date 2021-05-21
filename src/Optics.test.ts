import { Endomorphism, flow, increment, pipe, Predicate } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { get, getOption, modify, set } from './Optics'

describe('Optics', () => {
  describe('get', () => {
    it('should return element at given key', () => {
      interface User {
        name: string
        age: number
      }
      const gte =
        (m: number) =>
        (n: number): boolean =>
          n >= m
      const adult: Predicate<User> = flow(get('age'), gte(18))

      expect(pipe({ a: true, b: 1138, c: 'foo' }, get('b'))).toBe(1138)
      expect(adult({ name: 'Scott', age: 7 })).toBe(false)
      expect(adult({ name: 'Jonathan', age: 33 })).toBe(true)
    })
  })

  describe('getOption', () => {
    it('should help zoom into nullable properties', () => {
      interface Home {
        name: string
      }
      interface User {
        name: string
        home?: Home
      }

      const home = (user: User): string =>
        pipe(
          user,
          getOption('home'),
          O.match(
            () => `${user.name} is homeless`,
            (home) => `${user.name} lives at ${home.name}`,
          ),
        )

      expect(home({ name: 'Matthew', home: { name: 'Downton' } })).toBe(
        'Matthew lives at Downton',
      )
      expect(home({ name: 'Mary' })).toBe('Mary is homeless')
    })
  })

  describe('modify', () => {
    it('should modify element at given key using provided function', () => {
      interface User {
        name: string
        age: number
      }
      const birthday: Endomorphism<User> = modify('age', increment)

      expect(
        pipe(
          { a: true, b: 1138, c: 'foo' },
          modify('b', (n) => n + 199),
        ),
      ).toStrictEqual({ a: true, b: 1337, c: 'foo' })
      expect(pipe({ name: 'Jonathan', age: 33 }, birthday)).toStrictEqual({
        name: 'Jonathan',
        age: 34,
      })
    })
  })

  describe('set', () => {
    it('should replace element at given key', () => {
      interface User {
        name: string
        status: 'Employed' | 'Unemployed'
      }
      const fire: Endomorphism<User> = set('status', 'Unemployed')

      expect(
        pipe({ a: true, b: 1138, c: 'foo' }, set('b', 1337)),
      ).toStrictEqual({ a: true, b: 1337, c: 'foo' })
      expect(fire({ name: 'Thomas', status: 'Employed' })).toStrictEqual({
        name: 'Thomas',
        status: 'Unemployed',
      })
    })
  })
})
