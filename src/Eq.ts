import { eq, number, string } from 'fp-ts'
import { Eq } from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import { Aggregate } from './Aggregate'

export const eqType: Eq<unknown> = pipe(
  string.Eq,
  eq.contramap((a) => typeof a),
)

export const getEqSize = <T>(A: Aggregate<T>): Eq<T> =>
  pipe(number.Eq, eq.contramap(A.size))
