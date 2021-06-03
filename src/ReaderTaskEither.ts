import * as RTE from 'fp-ts/ReaderTaskEither'
import * as $O from './Optics'
import * as $S from './struct'

export const pick =
  <R extends $S.struct>() =>
  <K extends keyof R>(k: K) =>
    RTE.asks<Pick<R, K>, never, Pick<R, K>[K]>($O.get(k))
