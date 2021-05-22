import * as Ap from 'fp-ts/Apply'
import * as E from 'fp-ts/Eq'
import { constTrue, pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as $E from './Eq'
import { curry } from './function'

/**
 * {@link https://en.wikipedia.org/wiki/Cartesian_product}
 */
export const cartesian = Ap.sequenceT(RA.Apply)

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
export function words<A>(
  size: 3,
): (alphabeth: ReadonlyArray<A>) => ReadonlyArray<Readonly<[A, A, A]>>
export function words<A>(
  size: 2,
): (alphabeth: ReadonlyArray<A>) => ReadonlyArray<Readonly<[A, A]>>
export function words<A>(
  size: 1,
): (alphabeth: ReadonlyArray<A>) => ReadonlyArray<Readonly<[A]>>
export function words<A>(
  size: number,
): (
  alphabeth: ReadonlyArray<A>,
) =>
  | Readonly<[Readonly<[]>]>
  | ReadonlyArray<Readonly<[A, ...ReadonlyArray<A>]>>
export function words<A>(size: number) {
  return (
    alphabet: ReadonlyArray<A>,
  ):
    | Readonly<[Readonly<[]>]>
    | ReadonlyArray<Readonly<[A, ...ReadonlyArray<A>]>> =>
    size < 1
      ? ([[]] as const)
      : pipe(alphabet, curry(RA.replicate)(size), ([head, ...tail]) =>
          cartesian(head, ...tail),
        )
}

export const allElems =
  <A>(E: E.Eq<A>) =>
  (...elems: RNEA.ReadonlyNonEmptyArray<A>) =>
  (as: ReadonlyArray<A>): as is RNEA.ReadonlyNonEmptyArray<A> =>
    pipe(elems, RA.intersection(E)(as), curry($E.getEqSize(RA).equals)(elems))

export const anyElem =
  <A>(E: E.Eq<A>) =>
  (...elems: RNEA.ReadonlyNonEmptyArray<A>) =>
  (as: ReadonlyArray<A>): as is RNEA.ReadonlyNonEmptyArray<A> =>
    pipe(
      elems,
      RA.some((elem) => pipe(as, RA.elem(E)(elem))),
    )

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
export const same =
  <A>(E: E.Eq<A>) =>
  (as: ReadonlyArray<A>): boolean =>
    pipe(
      as,
      RA.matchLeft(constTrue, (head, tail) =>
        pipe(tail, RA.every(curry(E.equals)(head))),
      ),
    )
