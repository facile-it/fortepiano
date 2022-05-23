import * as E from 'fp-ts/Either'
import { Lazy, pipe } from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import * as IOE from 'fp-ts/IOEither'
import * as O from 'fp-ts/Option'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as $S from './struct'

export const pick =
  <R extends $S.Struct>() =>
  <K extends keyof R>(k: K) =>
    RTE.asks((r: Pick<R, K>) => r[k])

export const picks =
  <R extends $S.Struct>() =>
  <K extends keyof R, E, B>(
    k: K,
    f: (r: Pick<R, K>[K]) => RTE.ReaderTaskEither<Pick<R, K>, E, B>,
  ) =>
    picksW<R>()(k, f)

export const picksW =
  <R1 extends $S.Struct>() =>
  <K extends keyof R1, R2, E, B>(
    k: K,
    f: (r: Pick<R1, K>[K]) => RTE.ReaderTaskEither<R2, E, B>,
  ) =>
    pipe(pick<R1>()(k), RTE.chainW(f))

export const picksOptionK =
  <R extends $S.Struct>() =>
  <E>(onNone: Lazy<E>) =>
  <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => O.Option<B>) =>
    picks<R>()(k, RTE.fromOptionK(onNone)(f))

export const picksEitherK =
  <R extends $S.Struct>() =>
  <K extends keyof R, _E, B>(k: K, f: (r: Pick<R, K>[K]) => E.Either<_E, B>) =>
    picks<R>()(k, RTE.fromEitherK(f))

export const picksIOK =
  <R extends $S.Struct>() =>
  <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => IO.IO<B>) =>
    pipe(pick<R>()(k), RTE.chainIOK(f))

export const picksIOEitherK =
  <R extends $S.Struct>() =>
  <K extends keyof R, _E, B>(
    k: K,
    f: (r: Pick<R, K>[K]) => IOE.IOEither<_E, B>,
  ) =>
    picks<R>()(k, RTE.fromIOEitherK(f))

export const picksTaskK =
  <R extends $S.Struct>() =>
  <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => T.Task<B>) =>
    pipe(pick<R>()(k), RTE.chainTaskK(f))

export const picksTaskEitherK =
  <R extends $S.Struct>() =>
  <K extends keyof R, _E, B>(
    k: K,
    f: (r: Pick<R, K>[K]) => TE.TaskEither<_E, B>,
  ) =>
    picks<R>()(k, RTE.fromTaskEitherK(f))
