import * as E from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'

export interface Aggregate<A> {
  isEmpty: (a: A) => boolean
  size: (a: A) => number
}

export const getEq = <A>(A: Aggregate<A>): E.Eq<A> =>
  pipe(N.Eq, E.contramap(A.size))
