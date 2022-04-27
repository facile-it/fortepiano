import { either, option } from 'fp-ts'
import { Either } from 'fp-ts/Either'
import { IO } from 'fp-ts/IO'
import { IOEither } from 'fp-ts/IOEither'
import { Option } from 'fp-ts/Option'
import { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import { Task } from 'fp-ts/Task'
import { TaskEither } from 'fp-ts/TaskEither'
import * as $readerTaskEither from './ReaderTaskEither'

describe('ReaderTaskEither', () => {
  describe('pick', () => {
    it('should select only part of the context', async () => {
      interface R {
        foo: number
        bar: number
      }

      await expect(
        $readerTaskEither.pick<R>()('foo')({ foo: 42 })(),
      ).resolves.toStrictEqual(either.right(42))
      await expect(
        $readerTaskEither.pick<R>()('bar')({ bar: 1138 })(),
      ).resolves.toStrictEqual(either.right(1138))
    })
  })

  describe('picksW', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        host: string
        fetch: (id: number) => ReaderTaskEither<Pick<R, 'host'>, Error, string>
      }

      const fetch: R['fetch'] =
        (id) =>
        ({ host }) =>
        async () =>
          either.right(`${host}/${id}`)

      await expect(
        $readerTaskEither.picksW<R>()('fetch', (fetch) => fetch(42))({
          host: 'foobar',
          fetch,
        })(),
      ).resolves.toStrictEqual(either.right('foobar/42'))
    })
  })

  describe('picksOptionK', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        div: (n: number) => Option<number>
      }

      const div: R['div'] = (n) =>
        0 === n ? option.none : option.some(1138 / n)

      await expect(
        $readerTaskEither.picksOptionK<R>()(Error)('div', (div) => div(42))({
          div,
        })(),
      ).resolves.toStrictEqual(either.right(1138 / 42))
    })
  })

  describe('picksEitherK', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        div: (n: number) => Either<Error, number>
      }

      const div: R['div'] = (n) =>
        0 === n ? either.left(Error()) : either.right(1138 / n)

      await expect(
        $readerTaskEither.picksEitherK<R>()('div', (div) => div(42))({ div })(),
      ).resolves.toStrictEqual(either.right(1138 / 42))
    })
  })

  describe('picksIOK', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        read: (fd: number) => IO<string>
      }

      const read: R['read'] = (fd) => () => String(fd)

      await expect(
        $readerTaskEither.picksIOK<R>()('read', (read) => read(42))({ read })(),
      ).resolves.toStrictEqual(either.right('42'))
    })
  })

  describe('picksIOEitherK', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        read: (fd: number) => IOEither<Error, string>
      }

      const read: R['read'] = (fd) => () => either.right(String(fd))

      await expect(
        $readerTaskEither.picksIOEitherK<R>()('read', (read) => read(42))({
          read,
        })(),
      ).resolves.toStrictEqual(either.right('42'))
    })
  })

  describe('picksTaskK', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        fetch: (id: number) => Task<string>
      }

      const fetch: R['fetch'] = (id) => async () => String(id)

      await expect(
        $readerTaskEither.picksTaskK<R>()('fetch', (fetch) => fetch(42))({
          fetch,
        })(),
      ).resolves.toStrictEqual(either.right('42'))
    })
  })

  describe('picksTaskEitherK', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        fetch: (id: number) => TaskEither<Error, string>
      }

      const fetch: R['fetch'] = (id) => async () => either.right(String(id))

      await expect(
        $readerTaskEither.picksTaskEitherK<R>()('fetch', (fetch) => fetch(42))({
          fetch,
        })(),
      ).resolves.toStrictEqual(either.right('42'))
    })
  })
})
