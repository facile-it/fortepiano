import { readerTask } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { IO } from 'fp-ts/IO'
import { ReaderTask } from 'fp-ts/ReaderTask'
import { Task } from 'fp-ts/Task'
import * as $struct from './struct'
import { Struct } from './struct'

export const pick =
  <R extends Struct>() =>
  <K extends keyof R>(k: K) =>
    readerTask.asks<Pick<R, K>, Pick<R, K>[K]>($struct.lookup(k))

export const picks =
  <R extends Struct>() =>
  <K extends keyof R, B>(
    k: K,
    f: (r: Pick<R, K>[K]) => ReaderTask<Pick<R, K>, B>,
  ) =>
    picksW<R>()(k, f)

export const picksW =
  <R1 extends Struct>() =>
  <K extends keyof R1, R2, B>(
    k: K,
    f: (r: Pick<R1, K>[K]) => ReaderTask<R2, B>,
  ) =>
    pipe(pick<R1>()(k), readerTask.chainW(f))

export const picksIOK =
  <R extends Struct>() =>
  <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => IO<B>) =>
    picks<R>()(k, readerTask.fromIOK(f))

export const picksTaskK =
  <R extends Struct>() =>
  <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => Task<B>) =>
    picks<R>()(k, readerTask.fromTaskK(f))
