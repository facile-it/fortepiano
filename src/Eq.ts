import * as E from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'
import * as $A from './Aggregate'

export const eqType: E.Eq<unknown> = pipe(
  S.Eq,
  E.contramap((a) => typeof a),
)

export const getEqSize = <T>(A: $A.Aggregate<T>): E.Eq<T> =>
  pipe(N.Eq, E.contramap(A.size))
