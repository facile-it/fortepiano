import * as R from 'fp-ts/Reader'
import { pick, picks, picksW } from './Reader'

describe('Reader', () => {
  describe('pick', () => {
    it('should select only part of the context', () => {
      interface R {
        foo: number
        bar: number
      }

      expect(pick<R>()('foo')({ foo: 42 })).toBe(42)
      expect(pick<R>()('bar')({ bar: 1138 })).toBe(1138)
    })
  })

  describe('picks', () => {
    it('should return a computation on part of the context', async () => {
      interface _R {
        foo: number
        bar: number
        odd: (n: number) => R.Reader<Pick<_R, 'odd'>, number>
      }

      const odd: _R['odd'] =
        (n) =>
        ({ odd }) =>
          0 !== n % 2 ? n : odd(n - 1)({ odd })

      expect(picks<_R>()('odd', (odd) => odd(42))({ odd })).toBe(41)
    })
  })

  describe('picksW', () => {
    it('should return a computation on part of the context', () => {
      interface R {
        foo: number
        bar: number
        sum: (n: number) => R.Reader<Pick<R, 'foo'>, number>
      }

      const sum: R['sum'] =
        (n) =>
        ({ foo }) =>
          n + foo

      expect(picksW<R>()('sum', (sum) => sum(42))({ foo: 1138, sum })).toBe(
        42 + 1138,
      )
    })
  })
})
