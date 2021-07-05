import * as E from 'fp-ts/Either'
import { constUndefined, pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { chain, memory } from './Cache'

describe('Cache', () => {
  describe('chain', () => {
    const c0 = memory()
    const c1 = memory()
    const c = chain(c0, c1)

    describe('get', () => {
      it('should fail when no cache is warm', async () => {
        await expect(pipe(c.get('foo'), T.map(E.isLeft))()).resolves.toBe(true)
      })
      it('should succeed when first level cache is warm', async () => {
        await expect(
          pipe(c0.set('foo')('bar'), TE.apSecond(c.get('foo')))(),
        ).resolves.toStrictEqual(E.right('bar'))
      })
      it('should succeed when second level cache is warm', async () => {
        await expect(
          pipe(c1.set('foo')('bar'), TE.apSecond(c.get('foo')))(),
        ).resolves.toStrictEqual(E.right('bar'))
      })
      it('should resist to a cache level failure', async () => {
        await expect(
          pipe(
            c.set('foo')('bar'),
            TE.apFirst(c0.clear),
            TE.apS('c', c.get('foo')),
            TE.apS('c1', c1.get('foo')),
          )(),
        ).resolves.toStrictEqual(E.right({ c: 'bar', c1: 'bar' }))
      })
    })

    describe('set', () => {
      it('should warm up all cache levels', async () => {
        await expect(
          pipe(
            c.set('foo')('bar'),
            TE.apS('c', c.get('foo')),
            TE.apS('c0', c0.get('foo')),
            TE.apS('c1', c1.get('foo')),
          )(),
        ).resolves.toStrictEqual(E.right({ c: 'bar', c0: 'bar', c1: 'bar' }))
      })
    })

    describe('delete', () => {
      it('should delete an item from all cache levels', async () => {
        await expect(
          pipe(
            c.set('foo')('bar'),
            T.apFirst(c.delete('foo')),
            T.map(constUndefined),
            T.apS('c', pipe(c.get('foo'), T.map(E.isLeft))),
            T.apS('c0', pipe(c0.get('foo'), T.map(E.isLeft))),
            T.apS('c1', pipe(c1.get('foo'), T.map(E.isLeft))),
          )(),
        ).resolves.toStrictEqual({ c: true, c0: true, c1: true })
      })
    })

    describe('clear', () => {
      it('should clear all cache levels', async () => {
        await expect(
          pipe(
            c.set('foo')('bar'),
            T.apFirst(c.clear),
            T.map(constUndefined),
            T.apS('c', pipe(c.get('foo'), T.map(E.isLeft))),
            T.apS('c0', pipe(c0.get('foo'), T.map(E.isLeft))),
            T.apS('c1', pipe(c1.get('foo'), T.map(E.isLeft))),
          )(),
        ).resolves.toStrictEqual({ c: true, c0: true, c1: true })
      })
    })
  })
})
