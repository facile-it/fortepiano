import { eq as E, string } from 'fp-ts'
import { Eq } from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'

const eqType: Eq<unknown> = pipe(
  string.Eq,
  E.contramap((a) => typeof a)
)

export const eq = { ...E, eqType }
