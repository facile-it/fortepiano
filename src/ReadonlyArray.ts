import { apply, readonlyArray } from 'fp-ts'
import { Eq } from 'fp-ts/Eq'
import { constTrue, pipe } from 'fp-ts/function'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'
import * as $eq from './Eq'
import { curry } from './function'

/**
 * {@link https://en.wikipedia.org/wiki/Cartesian_product}
 */
export const cartesian = apply.sequenceT(readonlyArray.Apply)

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
      : pipe(
          alphabet,
          curry(readonlyArray.replicate)(size),
          ([head, ...tail]) => cartesian(head, ...tail),
        )
}

export const allElems =
  <A>(E: Eq<A>) =>
  (...elems: ReadonlyNonEmptyArray<A>) =>
  (as: ReadonlyArray<A>): as is ReadonlyNonEmptyArray<A> =>
    pipe(
      elems,
      readonlyArray.intersection(E)(as),
      curry($eq.getEqSize(readonlyArray).equals)(elems),
    )

export const anyElem =
  <A>(E: Eq<A>) =>
  (...elems: ReadonlyNonEmptyArray<A>) =>
  (as: ReadonlyArray<A>): as is ReadonlyNonEmptyArray<A> =>
    pipe(
      elems,
      readonlyArray.some((elem) => pipe(as, readonlyArray.elem(E)(elem))),
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
  <A>(E: Eq<A>) =>
  (as: ReadonlyArray<A>): boolean =>
    pipe(
      as,
      readonlyArray.matchLeft(constTrue, (head, tail) =>
        pipe(tail, readonlyArray.every(curry(E.equals)(head))),
      ),
    )
