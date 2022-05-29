import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import * as IOE from 'fp-ts/IOEither'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/Reader'
import * as RE from 'fp-ts/ReaderEither'
import * as RT from 'fp-ts/ReaderTask'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as $H from './Has'
import {
  derive,
  deriveEither,
  deriveIO,
  deriveIOEither,
  deriveOption,
  deriveReader,
  deriveReaderEither,
  deriveReaderTask,
  deriveReaderTaskEither,
  derives,
  derivesEither,
  derivesIO,
  derivesIOEither,
  derivesOption,
  derivesReader,
  derivesReaderEither,
  derivesReaderTask,
  derivesReaderTaskEither,
  derivesTask,
  derivesTaskEither,
  deriveTask,
  deriveTaskEither,
  pick,
  picks,
  picksEitherK,
  picksIOEitherK,
  picksIOK,
  picksOptionK,
  picksTaskEitherK,
  picksTaskK,
  picksW,
  read,
  readEither,
  readIO,
  readIOEither,
  readOption,
  readReader,
  readReaderEither,
  readReaderTask,
  readReaderTaskEither,
  reads,
  readsEither,
  readsIO,
  readsIOEither,
  readsOption,
  readsReader,
  readsReaderEither,
  readsReaderTask,
  readsReaderTaskEither,
  readsTask,
  readsTaskEither,
  readTask,
  readTaskEither,
} from './ReaderTaskEither'
import * as $S from './struct'

describe('ReaderTaskEither', () => {
  describe('pick', () => {
    it('should select only part of the context', async () => {
      interface R {
        foo: number
        bar: number
      }

      await expect(pick<R>()('foo')({ foo: 42 })()).resolves.toStrictEqual(
        E.right(42),
      )
      await expect(pick<R>()('bar')({ bar: 1138 })()).resolves.toStrictEqual(
        E.right(1138),
      )
    })
  })

  describe('picks', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        http: {
          host: string
          fetch: (
            id: number,
          ) => RTE.ReaderTaskEither<Pick<R, 'http'>, Error, string>
        }
      }

      const fetch: R['http']['fetch'] =
        (id) =>
        ({ http }) =>
        async () =>
          E.right(`${http.host}/${id}`)

      await expect(
        picks<R>()('http', ({ fetch }) => fetch(42))({
          http: { host: 'foobar', fetch },
        })(),
      ).resolves.toStrictEqual(E.right('foobar/42'))
    })
  })

  describe('picksW', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        host: string
        fetch: (
          id: number,
        ) => RTE.ReaderTaskEither<Pick<R, 'host'>, Error, string>
      }

      const fetch: R['fetch'] =
        (id) =>
        ({ host }) =>
        async () =>
          E.right(`${host}/${id}`)

      await expect(
        picksW<R>()('fetch', (fetch) => fetch(42))({ host: 'foobar', fetch })(),
      ).resolves.toStrictEqual(E.right('foobar/42'))
    })
  })

  describe('picksOptionK', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        div: (n: number) => O.Option<number>
      }

      const div: R['div'] = (n) => (0 === n ? O.none : O.some(1138 / n))

      await expect(
        picksOptionK<R>()(Error)('div', (div) => div(42))({ div })(),
      ).resolves.toStrictEqual(E.right(1138 / 42))
    })
  })

  describe('picksEitherK', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        div: (n: number) => E.Either<Error, number>
      }

      const div: R['div'] = (n) =>
        0 === n ? E.left(Error()) : E.right(1138 / n)

      await expect(
        picksEitherK<R>()('div', (div) => div(42))({ div })(),
      ).resolves.toStrictEqual(E.right(1138 / 42))
    })
  })

  describe('picksIOK', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        read: (fd: number) => IO.IO<string>
      }

      const read: R['read'] = (fd) => () => String(fd)

      await expect(
        picksIOK<R>()('read', (read) => read(42))({ read })(),
      ).resolves.toStrictEqual(E.right('42'))
    })
  })

  describe('picksIOEitherK', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        read: (fd: number) => IOE.IOEither<Error, string>
      }

      const read: R['read'] = (fd) => () => E.right(String(fd))

      await expect(
        picksIOEitherK<R>()('read', (read) => read(42))({ read })(),
      ).resolves.toStrictEqual(E.right('42'))
    })
  })

  describe('picksTaskK', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        fetch: (id: number) => T.Task<string>
      }

      const fetch: R['fetch'] = (id) => async () => String(id)

      await expect(
        picksTaskK<R>()('fetch', (fetch) => fetch(42))({ fetch })(),
      ).resolves.toStrictEqual(E.right('42'))
    })
  })

  describe('picksTaskEitherK', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        fetch: (id: number) => TE.TaskEither<Error, string>
      }

      const fetch: R['fetch'] = (id) => async () => E.right(String(id))

      await expect(
        picksTaskEitherK<R>()('fetch', (fetch) => fetch(42))({ fetch })(),
      ).resolves.toStrictEqual(E.right('42'))
    })
  })

  describe('read', () => {
    test('retrieving a slice of the environment', async () => {
      const tag = $H.tag<number>()

      await expect(read(tag)($H.singleton(tag, 42))()).resolves.toStrictEqual(
        E.right(42),
      )
    })
  })

  describe('readOption', () => {
    test('retrieving a slice of the environment', async () => {
      const tag = $H.tag<O.Option<number>>()

      await expect(
        readOption(tag)(Error)($H.singleton(tag, O.some(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readEither', () => {
    test('retrieving a slice of the environment', async () => {
      const tag = $H.tag<E.Either<Error, number>>()

      await expect(
        readEither(tag)($H.singleton(tag, E.right(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readIO', () => {
    test('retrieving a slice of the environment', async () => {
      const tag = $H.tag<IO.IO<number>>()

      await expect(
        readIO(tag)($H.singleton(tag, IO.of(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readIOEither', () => {
    test('retrieving a slice of the environment', async () => {
      const tag = $H.tag<IOE.IOEither<Error, number>>()

      await expect(
        readIOEither(tag)($H.singleton(tag, IOE.right(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readTask', () => {
    test('retrieving a slice of the environment', async () => {
      const tag = $H.tag<T.Task<number>>()

      await expect(
        readTask(tag)($H.singleton(tag, T.of(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readTaskEither', () => {
    test('retrieving a slice of the environment', async () => {
      const tag = $H.tag<TE.TaskEither<Error, number>>()

      await expect(
        readTaskEither(tag)($H.singleton(tag, TE.right(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readReader', () => {
    test('retrieving a slice of the environment', async () => {
      const tag = $H.tag<R.Reader<$S.Struct, number>>()

      await expect(
        readReader(tag)($H.singleton(tag, R.of(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readReaderEither', () => {
    test('retrieving a slice of the environment', async () => {
      const tag = $H.tag<RE.ReaderEither<$S.Struct, Error, number>>()

      await expect(
        readReaderEither(tag)($H.singleton(tag, RE.right(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readReaderTask', () => {
    test('retrieving a slice of the environment', async () => {
      const tag = $H.tag<RT.ReaderTask<$S.Struct, number>>()

      await expect(
        readReaderTask(tag)($H.singleton(tag, RT.of(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readReaderTaskEither', () => {
    test('retrieving a slice of the environment', async () => {
      const tag = $H.tag<RTE.ReaderTaskEither<$S.Struct, Error, number>>()

      await expect(
        readReaderTaskEither(tag)($H.singleton(tag, RTE.right(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('reads', () => {
    test('retrieving part of a slice of the environment', async () => {
      const tag = $H.tag<{ foo: number }>()

      await expect(
        reads(tag, 'foo')($H.singleton(tag, { foo: 42 }))(),
      ).resolves.toStrictEqual(E.right(42))
    })
    test('retrieving a function bound to its parent object', async () => {
      const tag = $H.tag<{ foo: number; bar(): number }>()

      await expect(
        pipe(
          reads(tag, 'bar'),
          RTE.map((f) => f()),
        )(
          $H.singleton(tag, {
            foo: 42,
            bar() {
              return this.foo
            },
          }),
        )(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readsOption', () => {
    test('retrieving part of a slice of the environment', async () => {
      const tag = $H.tag<{ foo: O.Option<number> }>()

      await expect(
        readsOption(tag, 'foo')(Error)(
          $H.singleton(tag, { foo: O.some(42) }),
        )(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readsEither', () => {
    test('retrieving part of a slice of the environment', async () => {
      const tag = $H.tag<{ foo: E.Either<Error, number> }>()

      await expect(
        readsEither(tag, 'foo')($H.singleton(tag, { foo: E.right(42) }))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readsIO', () => {
    test('retrieving part of a slice of the environment', async () => {
      const tag = $H.tag<{ foo: IO.IO<number> }>()

      await expect(
        readsIO(tag, 'foo')($H.singleton(tag, { foo: IO.of(42) }))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readsIOEither', () => {
    test('retrieving part of a slice of the environment', async () => {
      const tag = $H.tag<{ foo: IOE.IOEither<Error, number> }>()

      await expect(
        readsIOEither(tag, 'foo')($H.singleton(tag, { foo: IOE.right(42) }))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readsTask', () => {
    test('retrieving part of a slice of the environment', async () => {
      const tag = $H.tag<{ foo: T.Task<number> }>()

      await expect(
        readsTask(tag, 'foo')($H.singleton(tag, { foo: T.of(42) }))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readsTaskEither', () => {
    test('retrieving part of a slice of the environment', async () => {
      const tag = $H.tag<{ foo: TE.TaskEither<Error, number> }>()

      await expect(
        readsTaskEither(tag, 'foo')($H.singleton(tag, { foo: TE.right(42) }))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readsReader', () => {
    test('retrieving part of a slice of the environment', async () => {
      const tag = $H.tag<{ foo: R.Reader<$S.Struct, number> }>()

      await expect(
        readsReader(tag, 'foo')($H.singleton(tag, { foo: R.of(42) }))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readsReaderEither', () => {
    test('retrieving part of a slice of the environment', async () => {
      const tag = $H.tag<{ foo: RE.ReaderEither<$S.Struct, Error, number> }>()

      await expect(
        readsReaderEither(
          tag,
          'foo',
        )($H.singleton(tag, { foo: RE.right(42) }))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readsReaderTask', () => {
    test('retrieving part of a slice of the environment', async () => {
      const tag = $H.tag<{ foo: RT.ReaderTask<$S.Struct, number> }>()

      await expect(
        readsReaderTask(tag, 'foo')($H.singleton(tag, { foo: RT.of(42) }))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('readsReaderTaskEither', () => {
    test('retrieving part of a slice of the environment', async () => {
      const tag = $H.tag<{
        foo: RTE.ReaderTaskEither<$S.Struct, Error, number>
      }>()

      await expect(
        readsReaderTaskEither(
          tag,
          'foo',
        )($H.singleton(tag, { foo: RTE.right(42) }))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('derive', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<() => number>()

      await expect(
        derive(tag)()($H.singleton(tag, () => 42))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('deriveOption', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<() => O.Option<number>>()

      await expect(
        deriveOption(tag)(Error)()($H.singleton(tag, () => O.some(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('deriveEither', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<() => E.Either<Error, number>>()

      await expect(
        deriveEither(tag)()($H.singleton(tag, () => E.right(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('deriveIO', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<() => IO.IO<number>>()

      await expect(
        deriveIO(tag)()($H.singleton(tag, () => IO.of(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('deriveIOEither', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<() => IOE.IOEither<Error, number>>()

      await expect(
        deriveIOEither(tag)()($H.singleton(tag, () => IOE.right(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('deriveTask', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<() => T.Task<number>>()

      await expect(
        deriveTask(tag)()($H.singleton(tag, () => T.of(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('deriveTaskEither', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<() => TE.TaskEither<Error, number>>()

      await expect(
        deriveTaskEither(tag)()($H.singleton(tag, () => TE.right(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('deriveReader', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<() => R.Reader<$S.Struct, number>>()

      await expect(
        deriveReader(tag)()($H.singleton(tag, () => R.of(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('deriveReaderEither', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<() => RE.ReaderEither<$S.Struct, Error, number>>()

      await expect(
        deriveReaderEither(tag)()($H.singleton(tag, () => RE.right(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('deriveReaderTask', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<() => RT.ReaderTask<$S.Struct, number>>()

      await expect(
        deriveReaderTask(tag)()($H.singleton(tag, () => RT.of(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('deriveReaderTaskEither', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<() => RTE.ReaderTaskEither<$S.Struct, Error, number>>()

      await expect(
        deriveReaderTaskEither(tag)()($H.singleton(tag, () => RTE.right(42)))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('derives', () => {
    test('deriving a function from part of a slice of the environment', async () => {
      const tag = $H.tag<{ foo: () => number }>()

      await expect(
        derives(tag, 'foo')()($H.singleton(tag, { foo: () => 42 }))(),
      ).resolves.toStrictEqual(E.right(42))
    })
    test('deriving a function bound to its parent object', async () => {
      const tag = $H.tag<{ foo: number; bar(): number }>()

      await expect(
        derives(tag, 'bar')()(
          $H.singleton(tag, {
            foo: 42,
            bar() {
              return this.foo
            },
          }),
        )(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('derivesOption', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<{ foo: () => O.Option<number> }>()

      await expect(
        derivesOption(tag, 'foo')(Error)()(
          $H.singleton(tag, { foo: () => O.some(42) }),
        )(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('derivesEither', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<{ foo: () => E.Either<Error, number> }>()

      await expect(
        derivesEither(tag, 'foo')()(
          $H.singleton(tag, { foo: () => E.right(42) }),
        )(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('derivesIO', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<{ foo: () => IO.IO<number> }>()

      await expect(
        derivesIO(tag, 'foo')()($H.singleton(tag, { foo: () => IO.of(42) }))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('derivesIOEither', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<{ foo: () => IOE.IOEither<Error, number> }>()

      await expect(
        derivesIOEither(tag, 'foo')()(
          $H.singleton(tag, { foo: () => IOE.right(42) }),
        )(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('derivesTask', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<{ foo: () => T.Task<number> }>()

      await expect(
        derivesTask(tag, 'foo')()($H.singleton(tag, { foo: () => T.of(42) }))(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('derivesTaskEither', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<{ foo: () => TE.TaskEither<Error, number> }>()

      await expect(
        derivesTaskEither(tag, 'foo')()(
          $H.singleton(tag, { foo: () => TE.right(42) }),
        )(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('derivesReader', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<{ foo: () => R.Reader<$S.Struct, number> }>()

      await expect(
        derivesReader(tag, 'foo')()(
          $H.singleton(tag, { foo: () => R.of(42) }),
        )(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('derivesReaderEither', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<{
        foo: () => RE.ReaderEither<$S.Struct, Error, number>
      }>()

      await expect(
        derivesReaderEither(tag, 'foo')()(
          $H.singleton(tag, { foo: () => RE.right(42) }),
        )(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('derivesReaderTask', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<{ foo: () => RT.ReaderTask<$S.Struct, number> }>()

      await expect(
        derivesReaderTask(tag, 'foo')()(
          $H.singleton(tag, { foo: () => RT.of(42) }),
        )(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })

  describe('derivesReaderTaskEither', () => {
    test('deriving a function from a slice of the environment', async () => {
      const tag = $H.tag<{
        foo: () => RTE.ReaderTaskEither<$S.Struct, Error, number>
      }>()

      await expect(
        derivesReaderTaskEither(tag, 'foo')()(
          $H.singleton(tag, { foo: () => RTE.right(42) }),
        )(),
      ).resolves.toStrictEqual(E.right(42))
    })
  })
})
