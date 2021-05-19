import * as E from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'

const eqType: E.Eq<unknown> = pipe(
  S.Eq,
  E.contramap((a) => typeof a),
)

export const eq = { ...E, eqType }
