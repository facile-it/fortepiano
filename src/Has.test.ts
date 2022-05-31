import { pipe } from 'fp-ts/function'
import { lookup, modifyAt, singleton, tag, upsertAt } from './Has'

describe('Has', () => {
  describe('tag', () => {
    test('creating unique tags', () => {
      expect(tag<number>().key).not.toStrictEqual(tag<number>().key)
    })
  })

  describe('singleton', () => {
    test('creating Has with single value', () => {
      const _tag = tag<number>()

      expect(singleton(_tag, 42)).toStrictEqual({ [_tag.key]: 42 })
    })
  })

  describe('lookup', () => {
    test('retrieving value', () => {
      const _tag = tag<number>()

      expect(pipe(singleton(_tag, 42), lookup(_tag))).toStrictEqual(42)
    })
  })

  describe('upsertAt', () => {
    test('adding value', () => {
      const fooTag = tag<number>()
      const barTag = tag<string>()
      const has = pipe(singleton(fooTag, 42), upsertAt(barTag, 'foobar'))

      expect(pipe(has, lookup(fooTag))).toStrictEqual(42)
      expect(pipe(has, lookup(barTag))).toStrictEqual('foobar')
    })
    test('replacing value', () => {
      const _tag = tag<number>()

      expect(
        pipe(singleton(_tag, 42), upsertAt(_tag, 1138), lookup(_tag)),
      ).toStrictEqual(1138)
    })
  })

  describe('modifyAt', () => {
    test('modifying value', () => {
      const _tag = tag<number>()

      expect(
        pipe(
          singleton(_tag, 42),
          modifyAt(_tag, (n) => n * 2),
          lookup(_tag),
        ),
      ).toStrictEqual(42 * 2)
    })
  })
})
