import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as RE from 'fp-ts/ReaderEither'
import { pick, picksEitherK, picksOptionK, picksW } from './ReaderEither'

describe('ReaderEither', () => {
  describe('pick', () => {
    it('should select only part of the context', () => {
      interface R {
        foo: number
        bar: number
      }

      expect(pick<R>()('foo')({ foo: 42 })).toStrictEqual(E.right(42))
      expect(pick<R>()('bar')({ bar: 1138 })).toStrictEqual(E.right(1138))
    })
  })

  describe('picksW', () => {
    it('should return a computation on part of the context', () => {
      interface R {
        foo: number
        bar: number
        div: (n: number) => RE.ReaderEither<Pick<R, 'foo'>, Error, number>
      }

      const div: R['div'] =
        (n) =>
        ({ foo }) =>
          0 === foo ? E.left(Error()) : E.right(n / foo)

      expect(
        picksW<R>()('div', (div) => div(42))({ foo: 1138, div }),
      ).toStrictEqual(E.right(42 / 1138))
    })
  })

  describe('picksOptionK', () => {
    it('should return a computation on part of the context', () => {
      interface R {
        foo: number
        bar: number
        div: (n: number) => O.Option<number>
      }

      const div: R['div'] = (n) => (0 === n ? O.none : O.some(1138 / n))

      expect(
        picksOptionK<R>()(Error)('div', (div) => div(42))({ div }),
      ).toStrictEqual(E.right(1138 / 42))
    })
  })

  describe('picksEitherK', () => {
    it('should return a computation on part of the context', () => {
      interface R {
        foo: number
        bar: number
        div: (n: number) => E.Either<Error, number>
      }

      const div: R['div'] = (n) =>
        0 === n ? E.left(Error()) : E.right(1138 / n)

      expect(picksEitherK<R>()('div', (div) => div(42))({ div })).toStrictEqual(
        E.right(1138 / 42),
      )
    })
  })
})
