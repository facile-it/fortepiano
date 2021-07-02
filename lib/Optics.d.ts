import * as O from 'fp-ts/Option';
import * as $S from './struct';
export declare type Getter<S extends $S.struct, A> = (s: S) => A;
export declare type Setter<S extends $S.struct, A> = (a: A) => (s: S) => S;
export declare type Modifier<S extends $S.struct, A> = (f: (a: A) => A) => (s: S) => S;
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
export declare const get: <S extends object, P extends keyof S>(p: P) => Getter<S, S[P]>;
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
export declare const getOption: <S extends object, P extends keyof S>(p: P) => Getter<S, O.Option<NonNullable<S[P]>>>;
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
export declare const modify: <S extends object, P extends keyof S>(p: P, f: (a: S[P]) => S[P]) => (s: S) => S;
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
export declare const set: <S extends object, P extends keyof S>(p: P, a: S[P]) => (s: S) => S;
export declare const optics: {
    get: <S extends object, P extends keyof S>(p: P) => Getter<S, S[P]>;
    getOption: <S_1 extends object, P_1 extends keyof S_1>(p: P_1) => Getter<S_1, O.Option<NonNullable<S_1[P_1]>>>;
    modify: <S_2 extends object, P_2 extends keyof S_2>(p: P_2, f: (a: S_2[P_2]) => S_2[P_2]) => (s: S_2) => S_2;
    set: <S_3 extends object, P_3 extends keyof S_3>(p: P_3, a: S_3[P_3]) => (s: S_3) => S_3;
};
