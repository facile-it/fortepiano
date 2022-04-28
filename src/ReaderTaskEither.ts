import { readerTaskEither } from 'fp-ts'
import { Either } from 'fp-ts/Either'
import { Lazy, pipe } from 'fp-ts/function'
import { IO } from 'fp-ts/IO'
import { IOEither } from 'fp-ts/IOEither'
import { Option } from 'fp-ts/Option'
import { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import { Task } from 'fp-ts/Task'
import { TaskEither } from 'fp-ts/TaskEither'
import { Struct } from './struct'

export const pick =
  <R extends Struct>() =>
  <K extends keyof R>(k: K) =>
    readerTaskEither.asks((r: Pick<R, K>) => r[k])

export const picks =
  <R extends Struct>() =>
  <K extends keyof R, E, B>(
    k: K,
    f: (r: Pick<R, K>[K]) => ReaderTaskEither<Pick<R, K>, E, B>,
  ) =>
    picksW<R>()(k, f)

export const picksW =
  <R1 extends Struct>() =>
  <K extends keyof R1, R2, E, B>(
    k: K,
    f: (r: Pick<R1, K>[K]) => ReaderTaskEither<R2, E, B>,
  ) =>
    pipe(pick<R1>()(k), readerTaskEither.chainW(f))

export const picksOptionK =
  <R extends Struct>() =>
  <E>(onNone: Lazy<E>) =>
  <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => Option<B>) =>
    picks<R>()(k, readerTaskEither.fromOptionK(onNone)(f))

export const picksEitherK =
  <R extends Struct>() =>
  <K extends keyof R, _E, B>(k: K, f: (r: Pick<R, K>[K]) => Either<_E, B>) =>
    picks<R>()(k, readerTaskEither.fromEitherK(f))

export const picksIOK =
  <R extends Struct>() =>
  <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => IO<B>) =>
    pipe(pick<R>()(k), readerTaskEither.chainIOK(f))

export const picksIOEitherK =
  <R extends Struct>() =>
  <K extends keyof R, _E, B>(k: K, f: (r: Pick<R, K>[K]) => IOEither<_E, B>) =>
    picks<R>()(k, readerTaskEither.fromIOEitherK(f))

export const picksTaskK =
  <R extends Struct>() =>
  <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => Task<B>) =>
    pipe(pick<R>()(k), readerTaskEither.chainTaskK(f))

export const picksTaskEitherK =
  <R extends Struct>() =>
  <K extends keyof R, _E, B>(
    k: K,
    f: (r: Pick<R, K>[K]) => TaskEither<_E, B>,
  ) =>
    picks<R>()(k, readerTaskEither.fromTaskEitherK(f))
