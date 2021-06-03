import * as E from 'fp-ts/Eq';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
/**
 * {@link https://en.wikipedia.org/wiki/Cartesian_product}
 */
export declare const cartesian: <T extends (readonly any[])[]>(...t: T & {
    readonly 0: readonly any[];
}) => readonly { [K in keyof T]: [T[K]] extends [readonly (infer A)[]] ? A : never; }[];
/**
 * {@link https://en.wikipedia.org/wiki/Word_(group_theory)}
 *
 * @example
 * import { readonlyArray } from 'fp-ts'
 * import { pipe } from 'fp-ts/function'
 *
 * // https://en.wikipedia.org/wiki/Rock_paper_scissors#Additional_weapons
 * const shapes = ['Rock', 'Paper', 'Scissors', 'Spock', 'Lizard'] as const
 * const win = (a: number, b: number): boolean =>
 *   !!{ 1: true, 3: true }[(5 + a - b) % 5]
 *
 * expect(
 *   pipe(
 *     shapes,
 *     readonlyArray.mapWithIndex((i, a) => [i, a] as const),
 *     words(2),
 *     readonlyArray.filter(([[a], [b]]) => win(a, b)),
 *     readonlyArray.map(([[, a], [, b]]) => `${a} defeats ${b}`)
 *   )
 * ).toStrictEqual([
 *   'Rock defeats Scissors',
 *   'Rock defeats Lizard',
 *   'Paper defeats Rock',
 *   'Paper defeats Spock',
 *   'Scissors defeats Paper',
 *   'Scissors defeats Lizard',
 *   'Spock defeats Rock',
 *   'Spock defeats Scissors',
 *   'Lizard defeats Paper',
 *   'Lizard defeats Spock',
 * ])
 */
export declare function words<A>(size: 3): (alphabeth: ReadonlyArray<A>) => ReadonlyArray<Readonly<[A, A, A]>>;
export declare function words<A>(size: 2): (alphabeth: ReadonlyArray<A>) => ReadonlyArray<Readonly<[A, A]>>;
export declare function words<A>(size: 1): (alphabeth: ReadonlyArray<A>) => ReadonlyArray<Readonly<[A]>>;
export declare function words<A>(size: number): (alphabeth: ReadonlyArray<A>) => Readonly<[Readonly<[]>]> | ReadonlyArray<Readonly<[A, ...ReadonlyArray<A>]>>;
export declare const allElems: <A>(E: E.Eq<A>) => (...elems: RNEA.ReadonlyNonEmptyArray<A>) => (as: readonly A[]) => as is RNEA.ReadonlyNonEmptyArray<A>;
export declare const anyElem: <A>(E: E.Eq<A>) => (...elems: RNEA.ReadonlyNonEmptyArray<A>) => (as: readonly A[]) => as is RNEA.ReadonlyNonEmptyArray<A>;
/**
 * @example
 * import { eq, string } from 'fp-ts'
 * import { Eq } from 'fp-ts/Eq'
 * import { pipe } from 'fp-ts/function'
 *
 * type User = { name: string; mother: string; father: string }
 *
 * const eqParents: Eq<User> = pipe(
 *   eq.tuple(string.Eq, string.Eq),
 *   eq.contramap(({ mother, father }) => [mother, father] as const)
 * )
 * const siblings = same(eqParents)
 *
 * expect(
 *   siblings([
 *     { name: 'Thomas', mother: 'Edith', father: 'Matthew' },
 *     { name: 'Thomas', mother: 'Edith', father: 'Richard' },
 *   ])
 * ).toBe(false)
 * expect(
 *   siblings([
 *     { name: 'Thomas', mother: 'Edith', father: 'Matthew' },
 *     { name: 'William', mother: 'Edith', father: 'Matthew' },
 *   ])
 * ).toBe(true)
 */
export declare const same: <A>(E: E.Eq<A>) => (as: readonly A[]) => boolean;
