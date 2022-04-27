import { either, task, taskEither } from 'fp-ts'
import { constUndefined, pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import * as $cache from './Cache'

describe('Cache', () => {
  describe('chain', () => {
    const c0 = $cache.memory()
    const c1 = $cache.memory()
    const c = $cache.chain(c0, c1)

    describe('get', () => {
      it('should fail when no cache is warm', async () => {
        await expect(
          pipe(c.get('foo', t.number), task.map(either.isLeft))(),
        ).resolves.toBe(true)
      })
      it('should succeed when first level cache is warm', async () => {
        await expect(
          pipe(
            c0.set('foo', t.string)('bar'),
            taskEither.apSecond(c.get('foo', t.string)),
          )(),
        ).resolves.toStrictEqual(either.right('bar'))
      })
      it('should succeed when second level cache is warm', async () => {
        await expect(
          pipe(
            c1.set('foo', t.string)('bar'),
            taskEither.apSecond(c.get('foo', t.string)),
          )(),
        ).resolves.toStrictEqual(either.right('bar'))
      })
      it('should resist to a cache level failure', async () => {
        await expect(
          pipe(
            c.set('foo', t.string)('bar'),
            taskEither.apFirst(c0.clear),
            taskEither.apS('c', c.get('foo', t.string)),
            taskEither.apS('c1', c1.get('foo', t.string)),
          )(),
        ).resolves.toStrictEqual(either.right({ c: 'bar', c1: 'bar' }))
      })
    })

    describe('set', () => {
      it('should warm up all cache levels', async () => {
        await expect(
          pipe(
            c.set('foo', t.string)('bar'),
            taskEither.apS('c', c.get('foo', t.string)),
            taskEither.apS('c0', c0.get('foo', t.string)),
            taskEither.apS('c1', c1.get('foo', t.string)),
          )(),
        ).resolves.toStrictEqual(
          either.right({ c: 'bar', c0: 'bar', c1: 'bar' }),
        )
      })
    })

    describe('delete', () => {
      it('should delete an item from all cache levels', async () => {
        await expect(
          pipe(
            c.set('foo', t.string)('bar'),
            task.apFirst(c.delete('foo')),
            task.map(constUndefined),
            task.apS(
              'c',
              pipe(c.get('foo', t.string), task.map(either.isLeft)),
            ),
            task.apS(
              'c0',
              pipe(c0.get('foo', t.string), task.map(either.isLeft)),
            ),
            task.apS(
              'c1',
              pipe(c1.get('foo', t.string), task.map(either.isLeft)),
            ),
          )(),
        ).resolves.toStrictEqual({ c: true, c0: true, c1: true })
      })
    })

    describe('clear', () => {
      it('should clear all cache levels', async () => {
        await expect(
          pipe(
            c.set('foo', t.string)('bar'),
            task.apFirst(c.clear),
            task.map(constUndefined),
            task.apS(
              'c',
              pipe(c.get('foo', t.string), task.map(either.isLeft)),
            ),
            task.apS(
              'c0',
              pipe(c0.get('foo', t.string), task.map(either.isLeft)),
            ),
            task.apS(
              'c1',
              pipe(c1.get('foo', t.string), task.map(either.isLeft)),
            ),
          )(),
        ).resolves.toStrictEqual({ c: true, c0: true, c1: true })
      })
    })
  })
})
