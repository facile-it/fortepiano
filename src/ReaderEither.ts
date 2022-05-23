import * as E from 'fp-ts/Either'
import { Lazy, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as RE from 'fp-ts/ReaderEither'
import * as $S from './struct'

export const pick =
  <R extends $S.Struct>() =>
  <K extends keyof R>(k: K) =>
    RE.asks((r: Pick<R, K>) => r[k])

export const picks =
  <R extends $S.Struct>() =>
  <K extends keyof R, E, B>(
    k: K,
    f: (r: Pick<R, K>[K]) => RE.ReaderEither<Pick<R, K>, E, B>,
  ) =>
    picksW<R>()(k, f)

export const picksW =
  <R1 extends $S.Struct>() =>
  <K extends keyof R1, R2, E, B>(
    k: K,
    f: (r: Pick<R1, K>[K]) => RE.ReaderEither<R2, E, B>,
  ) =>
    pipe(pick<R1>()(k), RE.chainW(f))

export const picksOptionK =
  <R extends $S.Struct>() =>
  <E>(onNone: Lazy<E>) =>
  <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => O.Option<B>) =>
    picks<R>()(k, RE.fromOptionK(onNone)(f))

export const picksEitherK =
  <R extends $S.Struct>() =>
  <K extends keyof R, _E, B>(k: K, f: (r: Pick<R, K>[K]) => E.Either<_E, B>) =>
    picks<R>()(k, RE.fromEitherK(f))
