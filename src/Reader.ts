import * as R from 'fp-ts/Reader'
import * as $O from './Optics'
import * as $S from './struct'

export const pick =
  <R extends $S.struct>() =>
  <K extends keyof R>(k: K) =>
    R.asks<Pick<R, K>, Pick<R, K>[K]>($O.get(k))
