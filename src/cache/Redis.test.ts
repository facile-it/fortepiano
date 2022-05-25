import * as E from 'fp-ts/Either'
import { constVoid, pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import redis from 'redis-mock'
import { $redis } from './Redis'

describe('Cache', () => {
  describe('redis', () => {
    describe('get', () => {
      it('should fail with a missing item', async () => {
        const _redis = $redis(redis.createClient)

        await expect(
          pipe(_redis.get('foo', t.unknown), T.map(E.isLeft))(),
        ).resolves.toBe(true)
      })
      it('should fail with wrong item encoding', async () => {
        const _redis = $redis(redis.createClient)

        await expect(
          pipe(
            'foo',
            _redis.set('foo', t.string),
            TE.chain(() => _redis.get('foo', t.number)),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
      it('should succeed with correct item encoding', async () => {
        const _redis = $redis(redis.createClient)

        await expect(
          pipe(
            'foo',
            _redis.set('foo', t.string),
            TE.chain(() => _redis.get('foo', t.string)),
            T.map(E.isRight),
          )(),
        ).resolves.toBe(true)
      })
    })

    describe('set', () => {
      it('should set string item properly', async () => {
        const _redis = $redis(redis.createClient)

        const result = await _redis.set('foo', t.string)('foo')()

        expect(result).toStrictEqual(E.of(constVoid()))
        await expect(_redis.get('foo', t.string)()).resolves.toStrictEqual(
          E.of('foo'),
        )
      })
      it('should set number item properly', async () => {
        const _redis = $redis(redis.createClient)

        const result = await _redis.set('foo', t.number)(42)()

        expect(result).toStrictEqual(E.of(constVoid()))
        await expect(_redis.get('foo', t.number)()).resolves.toStrictEqual(
          E.of(42),
        )
      })
      it('should set object item properly', async () => {
        const _redis = $redis(redis.createClient)
        const codec = t.type({ foo: t.string, bar: t.number })

        const result = await _redis.set('foo', codec)({ foo: 'foo', bar: 42 })()

        expect(result).toStrictEqual(E.of(constVoid()))
        await expect(_redis.get('foo', codec)()).resolves.toStrictEqual(
          E.of({ foo: 'foo', bar: 42 }),
        )
      })
    })

    describe('delete', () => {
      it('should delete an item', async () => {
        const _redis = $redis(redis.createClient)

        await expect(
          pipe(
            'foo',
            _redis.set('foo', t.string),
            TE.chainFirst(() => _redis.delete('foo')),
            TE.chain(() => _redis.get('foo', t.string)),
            T.map(E.isLeft),
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
            TE.chainFirst(() => _redis.clear),
            TE.chain(() => _redis.get('foo', t.string)),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })
  })
})
