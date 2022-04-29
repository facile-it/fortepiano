import { either, task, taskEither } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Memcached from 'memcached-mock'
import { $memcached } from './Memcached'

describe('Cache', () => {
  describe('memcached', () => {
    describe('get', () => {
      it('should fail with a missing item', async () => {
        const _memcached = $memcached(() => new Memcached())

        await expect(
          pipe(_memcached.get('foo', t.unknown), task.map(either.isLeft))(),
        ).resolves.toBe(true)
      })
      it('should fail with wrong item encoding', async () => {
        const _memcached = $memcached(() => new Memcached())

        await expect(
          pipe(
            'foo',
            _memcached.set('foo', t.string),
            taskEither.apSecond(_memcached.get('foo', t.number)),
            task.map(either.isLeft),
          )(),
        ).resolves.toBe(true)
      })
      it('should succeed with correct item encoding', async () => {
        const _memcached = $memcached(() => new Memcached())

        await expect(
          pipe(
            'foo',
            _memcached.set('foo', t.string),
            taskEither.apSecond(_memcached.get('foo', t.string)),
            task.map(either.isRight),
          )(),
        ).resolves.toBe(true)
      })
    })

    describe('delete', () => {
      it('should delete an item', async () => {
        const _memcached = $memcached(() => new Memcached())

        await expect(
          pipe(
            'foo',
            _memcached.set('foo', t.string),
            taskEither.apFirst(_memcached.delete('foo')),
            taskEither.apSecond(_memcached.get('foo', t.string)),
            task.map(either.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })

    describe('clear', () => {
      it('should clear the cache', async () => {
        const _memcached = $memcached(() => new Memcached())

        await expect(
          pipe(
            'foo',
            _memcached.set('foo', t.string),
            taskEither.apFirst(_memcached.clear),
            taskEither.apSecond(_memcached.get('foo', t.string)),
            task.map(either.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })
  })
})
