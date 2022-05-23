import { pipe } from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import * as RT from 'fp-ts/ReaderTask'
import * as T from 'fp-ts/Task'
import * as $S from './struct'

export const pick =
  <R extends $S.Struct>() =>
  <K extends keyof R>(k: K) =>
    RT.asks<Pick<R, K>, Pick<R, K>[K]>($S.lookup(k))

export const picks =
  <R extends $S.Struct>() =>
  <K extends keyof R, B>(
    k: K,
    f: (r: Pick<R, K>[K]) => RT.ReaderTask<Pick<R, K>, B>,
  ) =>
    picksW<R>()(k, f)

export const picksW =
  <R1 extends $S.Struct>() =>
  <K extends keyof R1, R2, B>(
    k: K,
    f: (r: Pick<R1, K>[K]) => RT.ReaderTask<R2, B>,
  ) =>
    pipe(pick<R1>()(k), RT.chainW(f))

export const picksIOK =
  <R extends $S.Struct>() =>
  <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => IO.IO<B>) =>
    picks<R>()(k, RT.fromIOK(f))

export const picksTaskK =
  <R extends $S.Struct>() =>
  <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => T.Task<B>) =>
    picks<R>()(k, RT.fromTaskK(f))
