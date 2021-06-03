import * as E from 'fp-ts/Either'
import * as IO from 'fp-ts/IO'
import * as IOE from 'fp-ts/IOEither'
import * as O from 'fp-ts/Option'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import {
  pick,
  picksEitherK,
  picksIOEitherK,
  picksIOK,
  picksOptionK,
  picksTaskEitherK,
  picksTaskK,
  picksW,
} from './ReaderTaskEither'

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
})
