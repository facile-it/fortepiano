import * as E from 'fp-ts/EIther'
import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { storage } from './Storage'

class MemoryStorage implements Storage {
  private as: Record<string, string> = {}

  getItem(key: string): string | null {
    return key in this.as ? this.as[key] : null
  }

  setItem(key: string, value: string): void {
    this.as[key] = value
  }

  removeItem(key: string): void {
    delete this.as[key]
  }

  clear(): void {
    this.as = {}
  }

  get length(): number {
    return Object.keys(this.as).length
  }

  key(_: number): string | null {
    return null
  }
}

describe('Cache', () => {
  describe('storage', () => {
    describe('get', () => {
      it('should fail with a missing item', async () => {
        const _storage = new MemoryStorage()

        await expect(
          pipe(storage(_storage).get('foo', t.unknown), T.map(E.isLeft))(),
        ).resolves.toBe(true)
      })
      it('should fail with wrong item encoding', async () => {
        const _storage = new MemoryStorage()

        await expect(
          pipe(
            'foo',
            storage(_storage).set('foo', t.string),
            TE.apSecond(storage(_storage).get('foo', t.number)),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
      it('should succeed with correct item encoding', async () => {
        const _storage = new MemoryStorage()

        await expect(
          pipe(
            'foo',
            storage(_storage).set('foo', t.string),
            TE.apSecond(storage(_storage).get('foo', t.string)),
            T.map(E.isRight),
          )(),
        ).resolves.toBe(true)
      })
    })

    describe('delete', () => {
      it('should delete an item', async () => {
        const _storage = new MemoryStorage()

        await expect(
          pipe(
            'foo',
            storage(_storage).set('foo', t.string),
            TE.apFirst(storage(_storage).delete('foo')),
            TE.apSecond(storage(_storage).get('foo', t.string)),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })

    describe('clear', () => {
      it('should clear the cache', async () => {
        const _storage = new MemoryStorage()

        await expect(
          pipe(
            'foo',
            storage(_storage).set('foo', t.string),
            TE.apFirst(storage(_storage).clear),
            TE.apSecond(storage(_storage).get('foo', t.string)),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })
  })
})
