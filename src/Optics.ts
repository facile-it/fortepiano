import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as $S from './struct'

export type Getter<S extends $S.struct, A> = (s: S) => A
export type Setter<S extends $S.struct, A> = (a: A) => (s: S) => S
export type Modifier<S extends $S.struct, A> = (f: (a: A) => A) => (s: S) => S

/**
 * @example
 * import { flow, Predicate } from 'fp-ts/function'
 *
 * type User = { name: string; age: number }
 *
 * const gte = (m: number) => (n: number): boolean => n >= m
 * const adult: Predicate<User> = flow(get('age'), gte(18))
 *
 * expect(adult({ name: 'Scott', age: 7 })).toBe(false)
 * expect(adult({ name: 'Jonathan', age: 33 })).toBe(true)
 */
export const get =
  <S extends $S.struct, P extends keyof S>(p: P): Getter<S, S[P]> =>
  (s) =>
    s[p]

/**
 * @example
 * type Home = { name: string }
 * type User = { name: string; home?: Home }
 *
 * const home = (user: User): string =>
 *   pipe(
 *     user,
 *     optics.getOption('home'),
 *     option.match(
 *       () => `${user.name} is homeless`,
 *       (home) => `${user.name} lives at ${home.name}`
 *     )
 *   )
 *
 * expect(home({ name: 'Matthew', home: { name: 'Downton' } })).toBe(
 *   'Matthew lives at Downton'
 * )
 * expect(home({ name: 'Mary' })).toBe('Mary is homeless')
 */
export const getOption = <S extends $S.struct, P extends keyof S>(
  p: P,
): Getter<S, O.Option<NonNullable<S[P]>>> => flow(get(p), O.fromNullable)

/**
 * @example
 * import { Endomorphism, increment } from 'fp-ts/function'
 *
 * type User = { name: string; age: number }
 *
 * const birthday: Endomorphism<User> = modify('age', increment)
 *
 * expect(
 *   birthday({ name: 'Jonathan', age: 33 })
 * ).toStrictEqual(
 *   { name: 'Jonathan', age: 34, }
 * )
 */
export const modify =
  <S extends $S.struct, P extends keyof S>(
    p: P,
    f: (a: S[P]) => S[P],
  ): ReturnType<Modifier<S, S[P]>> =>
  (s) => ({ ...s, [p]: f(s[p]) })

/**
 * @example
 * import { Endomorphism } from 'fp-ts/function'
 *
 * type User = { name: string; status: 'Employed' | 'Unemployed' }
 *
 * const fire: Endomorphism<User> = set('status', 'Unemployed')
 *
 * expect(
 *   fire({ name: 'Thomas', status: 'Employed' })
 * ).toStrictEqual(
 *   { name: 'Thomas', status: 'Unemployed' }
 * )
 */
export const set = <S extends $S.struct, P extends keyof S>(
  p: P,
  a: S[P],
): ReturnType<Setter<S, S[P]>> => modify(p, () => a)

export const optics = { get, getOption, modify, set }
