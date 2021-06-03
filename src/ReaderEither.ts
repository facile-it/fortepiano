import * as RE from 'fp-ts/ReaderEither'
import * as $O from './Optics'
import * as $S from './struct'

export const pick =
  <R extends $S.struct>() =>
  <K extends keyof R>(k: K) =>
    RE.asks<Pick<R, K>, never, Pick<R, K>[K]>($O.get(k))
