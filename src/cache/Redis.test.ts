import * as E from 'fp-ts/EIther'
import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import _redis from 'redis-mock'
import { redis } from './Redis'

describe('Cache', () => {
  describe('redis', () => {
    describe('get', () => {
      it('should fail with a missing item', async () => {
        const client = _redis.createClient()

        await expect(
          pipe(redis(client).get('foo', t.unknown), T.map(E.isLeft))(),
        ).resolves.toBe(true)
      })
      it('should fail with wrong item encoding', async () => {
        const client = _redis.createClient()

        await expect(
          pipe(
            'foo',
            redis(client).set('foo', t.string),
            TE.apSecond(redis(client).get('foo', t.number)),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
      it('should succeed with correct item encoding', async () => {
        const client = _redis.createClient()

        await expect(
          pipe(
            'foo',
            redis(client).set('foo', t.string),
            TE.apSecond(redis(client).get('foo', t.string)),
            T.map(E.isRight),
          )(),
        ).resolves.toBe(true)
      })
    })

    describe('delete', () => {
      it('should delete an item', async () => {
        const client = _redis.createClient()

        await expect(
          pipe(
            'foo',
            redis(client).set('foo', t.string),
            TE.apFirst(redis(client).delete('foo')),
            TE.apSecond(redis(client).get('foo', t.string)),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })

    describe('clear', () => {
      it('should clear the cache', async () => {
        const client = _redis.createClient()

        await expect(
          pipe(
            'foo',
            redis(client).set('foo', t.string),
            TE.apFirst(redis(client).clear),
            TE.apSecond(redis(client).get('foo', t.string)),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })
  })
})
