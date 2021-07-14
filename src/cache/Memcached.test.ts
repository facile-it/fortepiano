import * as E from 'fp-ts/EIther'
import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
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
          pipe(_memcached.get('foo', t.unknown), T.map(E.isLeft))(),
        ).resolves.toBe(true)
      })
      it('should fail with wrong item encoding', async () => {
        const _memcached = $memcached(() => new Memcached())

        await expect(
          pipe(
            'foo',
            _memcached.set('foo', t.string),
            TE.apSecond(_memcached.get('foo', t.number)),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
      it('should succeed with correct item encoding', async () => {
        const _memcached = $memcached(() => new Memcached())

        await expect(
          pipe(
            'foo',
            _memcached.set('foo', t.string),
            TE.apSecond(_memcached.get('foo', t.string)),
            T.map(E.isRight),
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
            TE.apFirst(_memcached.delete('foo')),
            TE.apSecond(_memcached.get('foo', t.string)),
            T.map(E.isLeft),
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
            TE.apFirst(_memcached.clear),
            TE.apSecond(_memcached.get('foo', t.string)),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })
  })
})
