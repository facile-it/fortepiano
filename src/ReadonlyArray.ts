import { constTrue, pipe } from 'fp-ts/function'
import { apply, readonlyArray as RA } from 'fp-ts'
import { curry } from './function'
import { Eq } from 'fp-ts/Eq'
import { aggregate } from './Aggregate'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'

/**
 * {@link https://en.wikipedia.org/wiki/Cartesian_product}
 */
const cartesian = apply.sequenceT(RA.Apply)

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
function words<A>(
  size: 3
): (alphabeth: ReadonlyArray<A>) => ReadonlyArray<Readonly<[A, A, A]>>
function words<A>(
  size: 2
): (alphabeth: ReadonlyArray<A>) => ReadonlyArray<Readonly<[A, A]>>
function words<A>(
  size: 1
): (alphabeth: ReadonlyArray<A>) => ReadonlyArray<Readonly<[A]>>
function words<A>(
  size: number
): (
  alphabeth: ReadonlyArray<A>
) =>
  | Readonly<[Readonly<[]>]>
  | ReadonlyArray<Readonly<[A, ...ReadonlyArray<A>]>>
function words<A>(size: number) {
  return (
    alphabet: ReadonlyArray<A>
  ):
    | Readonly<[Readonly<[]>]>
    | ReadonlyArray<Readonly<[A, ...ReadonlyArray<A>]>> =>
    size < 1
      ? ([[]] as const)
      : pipe(alphabet, curry(RA.replicate)(size), ([head, ...tail]) =>
          cartesian(head, ...tail)
        )
}

const allElems = <A>(E: Eq<A>) => (...elems: ReadonlyNonEmptyArray<A>) => (
  as: ReadonlyArray<A>
): as is ReadonlyNonEmptyArray<A> =>
  pipe(elems, RA.intersection(E)(as), curry(EqSize.equals)(elems))

const anyElem = <A>(E: Eq<A>) => (...elems: ReadonlyNonEmptyArray<A>) => (
  as: ReadonlyArray<A>
): as is ReadonlyNonEmptyArray<A> =>
  pipe(
    elems,
    RA.some((elem) => pipe(as, RA.elem(E)(elem)))
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
const same = <A>(E: Eq<A>) => (as: ReadonlyArray<A>): boolean =>
  pipe(
    as,
    RA.matchLeft(constTrue, (head, tail) =>
      pipe(tail, RA.every(curry(E.equals)(head)))
    )
  )

const EqSize = aggregate.getEq(RA)

export const readonlyArray = {
  ...RA,
  cartesian,
  words,
  allElems,
  anyElem,
  same,
  EqSize,
}
