import { pipe } from 'fp-ts/function'
import * as R from 'fp-ts/Reader'
import * as $S from './struct'

export const pick =
  <R extends $S.Struct>() =>
  <K extends keyof R>(k: K) =>
    R.asks<Pick<R, K>, Pick<R, K>[K]>($S.lookup(k))

export const picks =
  <R extends $S.Struct>() =>
  <K extends keyof R, B>(
    k: K,
    f: (r: Pick<R, K>[K]) => R.Reader<Pick<R, K>, B>,
  ) =>
    picksW<R>()(k, f)

export const picksW =
  <R1 extends $S.Struct>() =>
  <K extends keyof R1, R2, B>(
    k: K,
    f: (r: Pick<R1, K>[K]) => R.Reader<R2, B>,
  ) =>
    pipe(pick<R1>()(k), R.chainW(f))
