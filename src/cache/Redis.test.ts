import { either, task, taskEither } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import redis from 'redis-mock'
import { $redis } from './Redis'

describe('Cache', () => {
  describe('redis', () => {
    describe('get', () => {
      it('should fail with a missing item', async () => {
        const _redis = $redis(redis.createClient)

        await expect(
          pipe(_redis.get('foo', t.unknown), task.map(either.isLeft))(),
        ).resolves.toBe(true)
      })
      it('should fail with wrong item encoding', async () => {
        const _redis = $redis(redis.createClient)

        await expect(
          pipe(
            'foo',
            _redis.set('foo', t.string),
            taskEither.apSecond(_redis.get('foo', t.number)),
            task.map(either.isLeft),
          )(),
        ).resolves.toBe(true)
      })
      it('should succeed with correct item encoding', async () => {
        const _redis = $redis(redis.createClient)

        await expect(
          pipe(
            'foo',
            _redis.set('foo', t.string),
            taskEither.apSecond(_redis.get('foo', t.string)),
            task.map(either.isRight),
          )(),
        ).resolves.toBe(true)
      })
    })

    describe('delete', () => {
      it('should delete an item', async () => {
        const _redis = $redis(redis.createClient)

        await expect(
          pipe(
            'foo',
            _redis.set('foo', t.string),
            taskEither.apFirst(_redis.delete('foo')),
            taskEither.apSecond(_redis.get('foo', t.string)),
            task.map(either.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })

    describe('clear', () => {
      it('should clear the cache', async () => {
        const _redis = $redis(redis.createClient)

        await expect(
          pipe(
            'foo',
            _redis.set('foo', t.string),
            taskEither.apFirst(_redis.clear),
            taskEither.apSecond(_redis.get('foo', t.string)),
            task.map(either.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })
  })
})
