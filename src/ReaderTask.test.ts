import * as IO from 'fp-ts/IO'
import * as RT from 'fp-ts/ReaderTask'
import * as T from 'fp-ts/Task'
import { pick, picksIOK, picksTaskK, picksW } from './ReaderTask'

describe('ReaderTask', () => {
  describe('pick', () => {
    it('should select only part of the context', async () => {
      interface R {
        foo: number
        bar: number
      }

      await expect(pick<R>()('foo')({ foo: 42 })()).resolves.toBe(42)
      await expect(pick<R>()('bar')({ bar: 1138 })()).resolves.toBe(1138)
    })
  })

  describe('picksW', () => {
    it('should return a computation on part of the context', async () => {
      interface R {
        foo: number
        bar: number
        host: string
        fetch: (id: number) => RT.ReaderTask<Pick<R, 'host'>, string>
      }

      const fetch: R['fetch'] =
        (id) =>
        ({ host }) =>
        async () =>
          `${host}/${id}`

      await expect(
        picksW<R>()('fetch', (fetch) => fetch(42))({ host: 'foobar', fetch })(),
      ).resolves.toBe('foobar/42')
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
      ).resolves.toBe('42')
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
      ).resolves.toBe('42')
    })
  })
})
