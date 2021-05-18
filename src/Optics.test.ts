import { option } from 'fp-ts'
import { Endomorphism, flow, increment, pipe, Predicate } from 'fp-ts/function'
import { optics } from './Optics'

describe('Optics', () => {
  describe('get', () => {
    it('should return element at given key', () => {
      type User = { name: string; age: number }
      const gte = (m: number) => (n: number): boolean => n >= m
      const adult: Predicate<User> = flow(optics.get('age'), gte(18))

      expect(pipe({ a: true, b: 1138, c: 'foo' }, optics.get('b'))).toBe(1138)
      expect(adult({ name: 'Scott', age: 7 })).toBe(false)
      expect(adult({ name: 'Jonathan', age: 33 })).toBe(true)
    })
  })

  describe('getOption', () => {
    it('should help zoom into nullable properties', () => {
      type Home = { name: string }
      type User = { name: string; home?: Home }

      const home = (user: User): string =>
        pipe(
          user,
          optics.getOption('home'),
          option.match(
            () => `${user.name} is homeless`,
            (home) => `${user.name} lives at ${home.name}`
          )
        )

      expect(home({ name: 'Matthew', home: { name: 'Downton' } })).toBe(
        'Matthew lives at Downton'
      )
      expect(home({ name: 'Mary' })).toBe('Mary is homeless')
    })
  })

  describe('modify', () => {
    it('should modify element at given key using provided function', () => {
      type User = { name: string; age: number }
      const birthday: Endomorphism<User> = optics.modify('age', increment)

      expect(
        pipe(
          { a: true, b: 1138, c: 'foo' },
          optics.modify('b', (n) => n + 199)
        )
      ).toStrictEqual({ a: true, b: 1337, c: 'foo' })
      expect(pipe({ name: 'Jonathan', age: 33 }, birthday)).toStrictEqual({
        name: 'Jonathan',
        age: 34,
      })
    })
  })

  describe('set', () => {
    it('should replace element at given key', () => {
      type User = { name: string; status: 'Employed' | 'Unemployed' }
      const fire: Endomorphism<User> = optics.set('status', 'Unemployed')

      expect(
        pipe({ a: true, b: 1138, c: 'foo' }, optics.set('b', 1337))
      ).toStrictEqual({ a: true, b: 1337, c: 'foo' })
      expect(fire({ name: 'Thomas', status: 'Employed' })).toStrictEqual({
        name: 'Thomas',
        status: 'Unemployed',
      })
    })
  })
})
