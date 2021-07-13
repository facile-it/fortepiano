import * as E from 'fp-ts/EIther'
import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import redis from 'redis-mock'
import { $redis } from './Redis'

describe('Cache', () => {
  describe('redis', () => {
    describe('get', () => {
      it('should fail with a missing item', async () => {
        const _redis = redis.createClient()

        await expect(
          pipe($redis(_redis).get('foo', t.unknown), T.map(E.isLeft))(),
        ).resolves.toBe(true)
      })
      it('should fail with wrong item encoding', async () => {
        const _redis = redis.createClient()

        await expect(
          pipe(
            'foo',
            $redis(_redis).set('foo', t.string),
            TE.apSecond($redis(_redis).get('foo', t.number)),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
      it('should succeed with correct item encoding', async () => {
        const _redis = redis.createClient()

        await expect(
          pipe(
            'foo',
            $redis(_redis).set('foo', t.string),
            TE.apSecond($redis(_redis).get('foo', t.string)),
            T.map(E.isRight),
          )(),
        ).resolves.toBe(true)
      })
    })

    describe('delete', () => {
      it('should delete an item', async () => {
        const _redis = redis.createClient()

        await expect(
          pipe(
            'foo',
            $redis(_redis).set('foo', t.string),
            TE.apFirst($redis(_redis).delete('foo')),
            TE.apSecond($redis(_redis).get('foo', t.string)),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })

    describe('clear', () => {
      it('should clear the cache', async () => {
        const _redis = redis.createClient()

        await expect(
          pipe(
            'foo',
            $redis(_redis).set('foo', t.string),
            TE.apFirst($redis(_redis).clear),
            TE.apSecond($redis(_redis).get('foo', t.string)),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })
  })
})
