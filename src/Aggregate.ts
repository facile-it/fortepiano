import { eq, number } from 'fp-ts'
import { Eq } from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'

export interface Aggregate<A> {
  isEmpty: (a: A) => boolean
  size: (a: A) => number
}

const getEq = <A>(A: Aggregate<A>): Eq<A> =>
  pipe(number.Eq, eq.contramap(A.size))

export const aggregate = { getEq }
