import { either, task, taskEither } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { storage } from './Storage'

class MemoryStorage implements Storage {
  private storage: Record<string, string> = {}

  getItem(key: string): string | null {
    return key in this.storage ? this.storage[key] : null
  }

  setItem(key: string, value: string): void {
    this.storage[key] = value
  }

  removeItem(key: string): void {
    delete this.storage[key]
  }

  clear(): void {
    this.storage = {}
  }

  get length(): number {
    return Object.keys(this.storage).length
  }

  key(_: number): string | null {
    return null
  }
}

describe('Cache', () => {
  describe('storage', () => {
    describe('get', () => {
      it('should fail with a missing item', async () => {
        const _storage = storage(() => new MemoryStorage())

        await expect(
          pipe(_storage.get('foo', t.unknown), task.map(either.isLeft))(),
        ).resolves.toBe(true)
      })
      it('should fail with wrong item encoding', async () => {
        const _storage = storage(() => new MemoryStorage())

        await expect(
          pipe(
            'foo',
            _storage.set('foo', t.string),
            taskEither.apSecond(_storage.get('foo', t.number)),
            task.map(either.isLeft),
          )(),
        ).resolves.toBe(true)
      })
      it('should succeed with correct item encoding', async () => {
        const _storage = storage(() => new MemoryStorage())

        await expect(
          pipe(
            'foo',
            _storage.set('foo', t.string),
            taskEither.apSecond(_storage.get('foo', t.string)),
            task.map(either.isRight),
          )(),
        ).resolves.toBe(true)
      })
    })

    describe('delete', () => {
      it('should delete an item', async () => {
        const _storage = storage(() => new MemoryStorage())

        await expect(
          pipe(
            'foo',
            _storage.set('foo', t.string),
            taskEither.apFirst(_storage.delete('foo')),
            taskEither.apSecond(_storage.get('foo', t.string)),
            task.map(either.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })

    describe('clear', () => {
      it('should clear the cache', async () => {
        const _storage = storage(() => new MemoryStorage())

        await expect(
          pipe(
            'foo',
            _storage.set('foo', t.string),
            taskEither.apFirst(_storage.clear),
            taskEither.apSecond(_storage.get('foo', t.string)),
            task.map(either.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })
  })
})
