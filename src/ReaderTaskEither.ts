import * as E from 'fp-ts/Either'
import { identity, Lazy, pipe } from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import * as IOE from 'fp-ts/IOEither'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/Reader'
import * as RE from 'fp-ts/ReaderEither'
import * as RT from 'fp-ts/ReaderTask'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { ValueOf } from '.'
import * as $H from './Has'
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

export const read = <A>(tag: $H.Tag<A>) =>
  pipe(
    RTE.ask<$H.Has<A>>(),
    RTE.map((r) => r[tag.key]),
  )

export const readOption =
  <A>(tag: $H.Tag<O.Option<A>>) =>
  <E>(onNone: Lazy<E>) =>
    pipe(read(tag), RTE.chainOptionK(onNone)(identity))

export const readEither = <E, A>(tag: $H.Tag<E.Either<E, A>>) =>
  pipe(read(tag), RTE.chainEitherKW(identity))

export const readIO = <A>(tag: $H.Tag<IO.IO<A>>) =>
  pipe(read(tag), RTE.chainIOK(identity))

export const readIOEither = <E, A>(tag: $H.Tag<IOE.IOEither<E, A>>) =>
  pipe(read(tag), RTE.chainIOEitherKW(identity))

export const readTask = <A>(tag: $H.Tag<T.Task<A>>) =>
  pipe(read(tag), RTE.chainTaskK(identity))

export const readTaskEither = <E, A>(tag: $H.Tag<TE.TaskEither<E, A>>) =>
  pipe(read(tag), RTE.chainTaskEitherKW(identity))

export const readReader = <R, A>(tag: $H.Tag<R.Reader<R, A>>) =>
  pipe(read(tag), RTE.chainReaderKW(identity))

export const readReaderEither = <R, E, A>(
  tag: $H.Tag<RE.ReaderEither<R, E, A>>,
) => pipe(read(tag), RTE.chainReaderEitherKW(identity))

export const readReaderTask = <R, A>(tag: $H.Tag<RT.ReaderTask<R, A>>) =>
  pipe(read(tag), RTE.chainReaderTaskKW(identity))

export const readReaderTaskEither = <R, E, A>(
  tag: $H.Tag<RTE.ReaderTaskEither<R, E, A>>,
) => pipe(read(tag), RTE.flattenW)

export const reads = <A extends $S.Struct, K extends keyof A>(
  tag: $H.Tag<A>,
  key: K,
) =>
  pipe(
    read(tag),
    RTE.map((a) => {
      const prop = a[key]

      return prop instanceof Function ? (prop.bind(a) as typeof prop) : prop
    }),
  )

export const readsOption =
  <
    A extends $S.Struct,
    K extends ValueOf<{
      [K in keyof A]: A[K] extends O.Option<unknown> ? K : never
    }>,
  >(
    tag: $H.Tag<A>,
    key: K,
  ) =>
  <E>(
    onNone: Lazy<E>,
  ): A[K] extends O.Option<infer B>
    ? RTE.ReaderTaskEither<$H.Has<A>, E, B>
    : never =>
    pipe(
      read(tag),
      RTE.chainOptionK(onNone)((a) => a[key] as any),
    ) as any

export const readsEither = <
  A extends $S.Struct,
  K extends ValueOf<{
    [K in keyof A]: A[K] extends E.Either<unknown, unknown> ? K : never
  }>,
>(
  tag: $H.Tag<A>,
  key: K,
): A[K] extends E.Either<infer E, infer B>
  ? RTE.ReaderTaskEither<$H.Has<A>, E, B>
  : never =>
  pipe(
    read(tag),
    RTE.chainEitherKW((a) => a[key] as any),
  ) as any

export const readsIO = <
  A extends $S.Struct,
  K extends ValueOf<{
    [K in keyof A]: A[K] extends IO.IO<unknown> ? K : never
  }>,
>(
  tag: $H.Tag<A>,
  key: K,
): A[K] extends IO.IO<infer B>
  ? RTE.ReaderTaskEither<$H.Has<A>, never, B>
  : never =>
  pipe(
    read(tag),
    RTE.chainIOK((a) => a[key] as any),
  ) as any

export const readsIOEither = <
  A extends $S.Struct,
  K extends ValueOf<{
    [K in keyof A]: A[K] extends IOE.IOEither<unknown, unknown> ? K : never
  }>,
>(
  tag: $H.Tag<A>,
  key: K,
): A[K] extends IOE.IOEither<infer E, infer B>
  ? RTE.ReaderTaskEither<$H.Has<A>, E, B>
  : never =>
  pipe(
    read(tag),
    RTE.chainIOEitherKW((a) => a[key] as any),
  ) as any

export const readsTask = <
  A extends $S.Struct,
  K extends ValueOf<{
    [K in keyof A]: A[K] extends T.Task<unknown> ? K : never
  }>,
>(
  tag: $H.Tag<A>,
  key: K,
): A[K] extends T.Task<infer B>
  ? RTE.ReaderTaskEither<$H.Has<A>, never, B>
  : never =>
  pipe(
    read(tag),
    RTE.chainTaskK((a) => a[key] as any),
  ) as any

export const readsTaskEither = <
  A extends $S.Struct,
  K extends ValueOf<{
    [K in keyof A]: A[K] extends TE.TaskEither<unknown, unknown> ? K : never
  }>,
>(
  tag: $H.Tag<A>,
  key: K,
): A[K] extends TE.TaskEither<infer E, infer B>
  ? RTE.ReaderTaskEither<$H.Has<A>, E, B>
  : never =>
  pipe(
    read(tag),
    RTE.chainTaskEitherKW((a) => a[key] as any),
  ) as any

export const readsReader = <
  A extends $S.Struct,
  K extends ValueOf<{
    [K in keyof A]: A[K] extends R.Reader<never, unknown> ? K : never
  }>,
>(
  tag: $H.Tag<A>,
  key: K,
): A[K] extends R.Reader<infer R, infer B>
  ? RTE.ReaderTaskEither<R & $H.Has<A>, never, B>
  : never =>
  pipe(
    read(tag),
    RTE.chainReaderKW((a) => a[key] as any),
  ) as any

export const readsReaderEither = <
  A extends $S.Struct,
  K extends ValueOf<{
    [K in keyof A]: A[K] extends RE.ReaderEither<never, unknown, unknown>
      ? K
      : never
  }>,
>(
  tag: $H.Tag<A>,
  key: K,
): A[K] extends RE.ReaderEither<infer R, infer E, infer B>
  ? RTE.ReaderTaskEither<R & $H.Has<A>, E, B>
  : never =>
  pipe(
    read(tag),
    RTE.chainReaderEitherKW((a) => a[key] as any),
  ) as any

export const readsReaderTask = <
  A extends $S.Struct,
  K extends ValueOf<{
    [K in keyof A]: A[K] extends RT.ReaderTask<never, unknown> ? K : never
  }>,
>(
  tag: $H.Tag<A>,
  key: K,
): A[K] extends RT.ReaderTask<infer R, infer B>
  ? RTE.ReaderTaskEither<R & $H.Has<A>, never, B>
  : never =>
  pipe(
    read(tag),
    RTE.chainReaderTaskKW((a) => a[key] as any),
  ) as any

export const readsReaderTaskEither = <
  A extends $S.Struct,
  K extends ValueOf<{
    [K in keyof A]: A[K] extends RTE.ReaderTaskEither<never, unknown, unknown>
      ? K
      : never
  }>,
>(
  tag: $H.Tag<A>,
  key: K,
): A[K] extends RTE.ReaderTaskEither<infer R, infer E, infer B>
  ? RTE.ReaderTaskEither<R & $H.Has<A>, E, B>
  : never =>
  pipe(
    read(tag),
    RTE.chainW((a) => a[key] as any),
  ) as any

export const derive =
  <A extends (...args: any[]) => any>(tag: $H.Tag<A>) =>
  (
    ...args: Parameters<Extract<A, (...args: any[]) => any>>
  ): A extends (...args: any[]) => infer B
    ? RTE.ReaderTaskEither<$H.Has<A>, never, B>
    : never =>
    pipe(
      read(tag),
      RTE.map((f) => f(...args)),
    ) as any

export const deriveOption =
  <A extends (...args: any[]) => O.Option<unknown>>(tag: $H.Tag<A>) =>
  <E>(onNone: Lazy<E>) =>
  (
    ...args: Parameters<Extract<A, (...args: any[]) => any>>
  ): A extends (...args: any[]) => O.Option<infer B>
    ? RTE.ReaderTaskEither<$H.Has<A>, E, B>
    : never =>
    pipe(
      read(tag),
      RTE.chainOptionK(onNone)((f) => f(...args)),
    ) as any

export const deriveEither =
  <A extends (...args: any[]) => E.Either<unknown, unknown>>(tag: $H.Tag<A>) =>
  (
    ...args: Parameters<Extract<A, (...args: any[]) => any>>
  ): A extends (...args: any[]) => E.Either<infer E, infer B>
    ? RTE.ReaderTaskEither<$H.Has<A>, E, B>
    : never =>
    pipe(
      read(tag),
      RTE.chainEitherKW((f) => f(...args)),
    ) as any

export const deriveIO =
  <A extends (...args: any[]) => IO.IO<unknown>>(tag: $H.Tag<A>) =>
  (
    ...args: Parameters<Extract<A, (...args: any[]) => any>>
  ): A extends (...args: any[]) => IO.IO<infer B>
    ? RTE.ReaderTaskEither<$H.Has<A>, never, B>
    : never =>
    pipe(
      read(tag),
      RTE.chainIOK((f) => f(...args)),
    ) as any

export const deriveIOEither =
  <A extends (...args: any[]) => IOE.IOEither<unknown, unknown>>(
    tag: $H.Tag<A>,
  ) =>
  (
    ...args: Parameters<Extract<A, (...args: any[]) => any>>
  ): A extends (...args: any[]) => IOE.IOEither<infer E, infer B>
    ? RTE.ReaderTaskEither<$H.Has<A>, E, B>
    : never =>
    pipe(
      read(tag),
      RTE.chainIOEitherKW((f) => f(...args)),
    ) as any

export const deriveTask =
  <A extends (...args: any[]) => T.Task<unknown>>(tag: $H.Tag<A>) =>
  (
    ...args: Parameters<Extract<A, (...args: any[]) => any>>
  ): A extends (...args: any[]) => T.Task<infer B>
    ? RTE.ReaderTaskEither<$H.Has<A>, never, B>
    : never =>
    pipe(
      read(tag),
      RTE.chainTaskK((f) => f(...args)),
    ) as any

export const deriveTaskEither =
  <A extends (...args: any[]) => TE.TaskEither<unknown, unknown>>(
    tag: $H.Tag<A>,
  ) =>
  (
    ...args: Parameters<Extract<A, (...args: any[]) => any>>
  ): A extends (...args: any[]) => TE.TaskEither<infer E, infer B>
    ? RTE.ReaderTaskEither<$H.Has<A>, E, B>
    : never =>
    pipe(
      read(tag),
      RTE.chainTaskEitherKW((f) => f(...args)),
    ) as any

export const deriveReader =
  <A extends (...args: any[]) => R.Reader<never, unknown>>(tag: $H.Tag<A>) =>
  (
    ...args: Parameters<Extract<A, (...args: any[]) => any>>
  ): A extends (...args: any[]) => R.Reader<infer R, infer B>
    ? RTE.ReaderTaskEither<R & $H.Has<A>, never, B>
    : never =>
    pipe(
      read(tag),
      RTE.chainReaderKW((f) => f(...args)),
    ) as any

export const deriveReaderEither =
  <A extends (...args: any[]) => RE.ReaderEither<never, unknown, unknown>>(
    tag: $H.Tag<A>,
  ) =>
  (
    ...args: Parameters<Extract<A, (...args: any[]) => any>>
  ): A extends (...args: any[]) => RE.ReaderEither<infer R, infer E, infer B>
    ? RTE.ReaderTaskEither<R & $H.Has<A>, E, B>
    : never =>
    pipe(
      read(tag),
      RTE.chainReaderEitherKW((f) => f(...args)),
    ) as any

export const deriveReaderTask =
  <A extends (...args: any[]) => RT.ReaderTask<never, unknown>>(
    tag: $H.Tag<A>,
  ) =>
  (
    ...args: Parameters<Extract<A, (...args: any[]) => any>>
  ): A extends (...args: any[]) => RT.ReaderTask<infer R, infer B>
    ? RTE.ReaderTaskEither<R & $H.Has<A>, never, B>
    : never =>
    pipe(
      read(tag),
      RTE.chainReaderTaskKW((f) => f(...args)),
    ) as any

export const deriveReaderTaskEither =
  <A extends (...args: any[]) => RTE.ReaderTaskEither<never, unknown, unknown>>(
    tag: $H.Tag<A>,
  ) =>
  (
    ...args: Parameters<Extract<A, (...args: any[]) => any>>
  ): A extends (
    ...args: any[]
  ) => RTE.ReaderTaskEither<infer R, infer E, infer B>
    ? RTE.ReaderTaskEither<R & $H.Has<A>, E, B>
    : never =>
    pipe(
      read(tag),
      RTE.chainW((f) => f(...args)),
    ) as any

export const derives =
  <
    A extends $S.Struct,
    K extends ValueOf<{
      [K in keyof A]: A[K] extends (...args: any[]) => any ? K : never
    }>,
  >(
    tag: $H.Tag<A>,
    key: K,
  ) =>
  (
    ...args: Parameters<Extract<A[K], (...args: any[]) => any>>
  ): A[K] extends (...args: any[]) => infer B
    ? RTE.ReaderTaskEither<$H.Has<A>, never, B>
    : never =>
    pipe(
      reads(tag, key),
      RTE.map((f) => (f as any)(...args)),
    ) as any

export const derivesOption =
  <
    A extends $S.Struct,
    K extends ValueOf<{
      [K in keyof A]: A[K] extends (...args: any[]) => O.Option<unknown>
        ? K
        : never
    }>,
  >(
    tag: $H.Tag<A>,
    key: K,
  ) =>
  <E>(onNone: Lazy<E>) =>
  (
    ...args: Parameters<Extract<A[K], (...args: any[]) => any>>
  ): A[K] extends (...args: any[]) => O.Option<infer B>
    ? RTE.ReaderTaskEither<$H.Has<A>, E, B>
    : never =>
    pipe(
      reads(tag, key),
      RTE.chainOptionK(onNone)((f) => (f as any)(...args)),
    ) as any

export const derivesEither =
  <
    A extends $S.Struct,
    K extends ValueOf<{
      [K in keyof A]: A[K] extends (
        ...args: any[]
      ) => E.Either<unknown, unknown>
        ? K
        : never
    }>,
  >(
    tag: $H.Tag<A>,
    key: K,
  ) =>
  (
    ...args: Parameters<Extract<A[K], (...args: any[]) => any>>
  ): A[K] extends (...args: any[]) => E.Either<infer E, infer B>
    ? RTE.ReaderTaskEither<$H.Has<A>, E, B>
    : never =>
    pipe(
      reads(tag, key),
      RTE.chainEitherKW((f) => (f as any)(...args)),
    ) as any

export const derivesIO =
  <
    A extends $S.Struct,
    K extends ValueOf<{
      [K in keyof A]: A[K] extends (...args: any[]) => IO.IO<unknown>
        ? K
        : never
    }>,
  >(
    tag: $H.Tag<A>,
    key: K,
  ) =>
  (
    ...args: Parameters<Extract<A[K], (...args: any[]) => any>>
  ): A[K] extends (...args: any[]) => IO.IO<infer B>
    ? RTE.ReaderTaskEither<$H.Has<A>, never, B>
    : never =>
    pipe(
      reads(tag, key),
      RTE.chainIOK((f) => (f as any)(...args)),
    ) as any

export const derivesIOEither =
  <
    A extends $S.Struct,
    K extends ValueOf<{
      [K in keyof A]: A[K] extends (
        ...args: any[]
      ) => IOE.IOEither<unknown, unknown>
        ? K
        : never
    }>,
  >(
    tag: $H.Tag<A>,
    key: K,
  ) =>
  (
    ...args: Parameters<Extract<A[K], (...args: any[]) => any>>
  ): A[K] extends (...args: any[]) => IOE.IOEither<infer E, infer B>
    ? RTE.ReaderTaskEither<$H.Has<A>, E, B>
    : never =>
    pipe(
      reads(tag, key),
      RTE.chainIOEitherKW((f) => (f as any)(...args)),
    ) as any

export const derivesTask =
  <
    A extends $S.Struct,
    K extends ValueOf<{
      [K in keyof A]: A[K] extends (...args: any[]) => T.Task<unknown>
        ? K
        : never
    }>,
  >(
    tag: $H.Tag<A>,
    key: K,
  ) =>
  (
    ...args: Parameters<Extract<A[K], (...args: any[]) => any>>
  ): A[K] extends (...args: any[]) => T.Task<infer B>
    ? RTE.ReaderTaskEither<$H.Has<A>, never, B>
    : never =>
    pipe(
      reads(tag, key),
      RTE.chainTaskK((f) => (f as any)(...args)),
    ) as any

export const derivesTaskEither =
  <
    A extends $S.Struct,
    K extends ValueOf<{
      [K in keyof A]: A[K] extends (
        ...args: any[]
      ) => TE.TaskEither<unknown, unknown>
        ? K
        : never
    }>,
  >(
    tag: $H.Tag<A>,
    key: K,
  ) =>
  (
    ...args: Parameters<Extract<A[K], (...args: any[]) => any>>
  ): A[K] extends (...args: any[]) => TE.TaskEither<infer E, infer B>
    ? RTE.ReaderTaskEither<$H.Has<A>, E, B>
    : never =>
    pipe(
      reads(tag, key),
      RTE.chainTaskEitherKW((f) => (f as any)(...args)),
    ) as any

export const derivesReader =
  <
    A extends $S.Struct,
    K extends ValueOf<{
      [K in keyof A]: A[K] extends (...args: any[]) => R.Reader<never, unknown>
        ? K
        : never
    }>,
  >(
    tag: $H.Tag<A>,
    key: K,
  ) =>
  (
    ...args: Parameters<Extract<A[K], (...args: any[]) => any>>
  ): A[K] extends (...args: any[]) => R.Reader<infer R, infer B>
    ? RTE.ReaderTaskEither<R & $H.Has<A>, never, B>
    : never =>
    pipe(
      reads(tag, key),
      RTE.chainReaderKW((f) => (f as any)(...args)),
    ) as any

export const derivesReaderEither =
  <
    A extends $S.Struct,
    K extends ValueOf<{
      [K in keyof A]: A[K] extends (
        ...args: any[]
      ) => RE.ReaderEither<never, unknown, unknown>
        ? K
        : never
    }>,
  >(
    tag: $H.Tag<A>,
    key: K,
  ) =>
  (
    ...args: Parameters<Extract<A[K], (...args: any[]) => any>>
  ): A[K] extends (...args: any[]) => RE.ReaderEither<infer R, infer E, infer B>
    ? RTE.ReaderTaskEither<R & $H.Has<A>, E, B>
    : never =>
    pipe(
      reads(tag, key),
      RTE.chainReaderEitherKW((f) => (f as any)(...args)),
    ) as any

export const derivesReaderTask =
  <
    A extends $S.Struct,
    K extends ValueOf<{
      [K in keyof A]: A[K] extends (
        ...args: any[]
      ) => RT.ReaderTask<never, unknown>
        ? K
        : never
    }>,
  >(
    tag: $H.Tag<A>,
    key: K,
  ) =>
  (
    ...args: Parameters<Extract<A[K], (...args: any[]) => any>>
  ): A[K] extends (...args: any[]) => RT.ReaderTask<infer R, infer B>
    ? RTE.ReaderTaskEither<R & $H.Has<A>, never, B>
    : never =>
    pipe(
      reads(tag, key),
      RTE.chainReaderTaskKW((f) => (f as any)(...args)),
    ) as any

export const derivesReaderTaskEither =
  <
    A extends $S.Struct,
    K extends ValueOf<{
      [K in keyof A]: A[K] extends (
        ...args: any[]
      ) => RTE.ReaderTaskEither<never, unknown, unknown>
        ? K
        : never
    }>,
  >(
    tag: $H.Tag<A>,
    key: K,
  ) =>
  (
    ...args: Parameters<Extract<A[K], (...args: any[]) => any>>
  ): A[K] extends (
    ...args: any[]
  ) => RTE.ReaderTaskEither<infer R, infer E, infer B>
    ? RTE.ReaderTaskEither<R & $H.Has<A>, E, B>
    : never =>
    pipe(
      reads(tag, key),
      RTE.chainW((f) => (f as any)(...args)),
    ) as any
