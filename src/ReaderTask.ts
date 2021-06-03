import * as RT from 'fp-ts/ReaderTask'
import * as $O from './Optics'
import * as $S from './struct'

export const pick =
  <R extends $S.struct>() =>
  <K extends keyof R>(k: K) =>
    RT.asks<Pick<R, K>, Pick<R, K>[K]>($O.get(k))
