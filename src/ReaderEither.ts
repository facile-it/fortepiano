import { readerEither } from 'fp-ts'
import { Either } from 'fp-ts/Either'
import { Lazy, pipe } from 'fp-ts/function'
import { Option } from 'fp-ts/Option'
import { ReaderEither } from 'fp-ts/ReaderEither'
import { Struct } from './_Struct'

export const pick =
  <R extends Struct>() =>
  <K extends keyof R>(k: K) =>
    readerEither.asks((r: Pick<R, K>) => r[k])

export const picks =
  <R extends Struct>() =>
  <K extends keyof R, E, B>(
    k: K,
    f: (r: Pick<R, K>[K]) => ReaderEither<Pick<R, K>, E, B>,
  ) =>
    picksW<R>()(k, f)

export const picksW =
  <R1 extends Struct>() =>
  <K extends keyof R1, R2, E, B>(
    k: K,
    f: (r: Pick<R1, K>[K]) => ReaderEither<R2, E, B>,
  ) =>
    pipe(pick<R1>()(k), readerEither.chainW(f))

export const picksOptionK =
  <R extends Struct>() =>
  <E>(onNone: Lazy<E>) =>
  <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => Option<B>) =>
    picks<R>()(k, readerEither.fromOptionK(onNone)(f))

export const picksEitherK =
  <R extends Struct>() =>
  <K extends keyof R, _E, B>(k: K, f: (r: Pick<R, K>[K]) => Either<_E, B>) =>
    picks<R>()(k, readerEither.fromEitherK(f))
