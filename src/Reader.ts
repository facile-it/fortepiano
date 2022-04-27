import { reader } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { Reader } from 'fp-ts/Reader'
import * as $struct from './struct'
import { struct } from './struct'

export const pick =
  <R extends struct>() =>
  <K extends keyof R>(k: K) =>
    reader.asks<Pick<R, K>, Pick<R, K>[K]>($struct.lookup(k))

export const picks =
  <R extends struct>() =>
  <K extends keyof R, B>(
    k: K,
    f: (r: Pick<R, K>[K]) => Reader<Pick<R, K>, B>,
  ) =>
    picksW<R>()(k, f)

export const picksW =
  <R1 extends struct>() =>
  <K extends keyof R1, R2, B>(k: K, f: (r: Pick<R1, K>[K]) => Reader<R2, B>) =>
    pipe(pick<R1>()(k), reader.chainW(f))
