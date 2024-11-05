import * as E from 'fp-ts/Eq'
import { constTrue, pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import { curry } from './function'

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
