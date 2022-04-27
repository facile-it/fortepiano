import { either, option } from 'fp-ts'
import { Either } from 'fp-ts/Either'
import { Option } from 'fp-ts/Option'
import { ReaderEither } from 'fp-ts/ReaderEither'
import * as $readerEither from './ReaderEither'

describe('ReaderEither', () => {
  describe('pick', () => {
    it('should select only part of the context', () => {
      interface R {
        foo: number
        bar: number
      }

      expect($readerEither.pick<R>()('foo')({ foo: 42 })).toStrictEqual(
        either.right(42),
      )
      expect($readerEither.pick<R>()('bar')({ bar: 1138 })).toStrictEqual(
        either.right(1138),
      )
    })
  })

  describe('picksW', () => {
    it('should return a computation on part of the context', () => {
      interface R {
        foo: number
        bar: number
        div: (n: number) => ReaderEither<Pick<R, 'foo'>, Error, number>
      }

      const div: R['div'] =
        (n) =>
        ({ foo }) =>
          0 === foo ? either.left(Error()) : either.right(n / foo)

      expect(
        $readerEither.picksW<R>()('div', (div) => div(42))({ foo: 1138, div }),
      ).toStrictEqual(either.right(42 / 1138))
    })
  })

  describe('picksOptionK', () => {
    it('should return a computation on part of the context', () => {
      interface R {
        foo: number
        bar: number
        div: (n: number) => Option<number>
      }

      const div: R['div'] = (n) =>
        0 === n ? option.none : option.some(1138 / n)

      expect(
        $readerEither.picksOptionK<R>()(Error)('div', (div) => div(42))({
          div,
        }),
      ).toStrictEqual(either.right(1138 / 42))
    })
  })

  describe('picksEitherK', () => {
    it('should return a computation on part of the context', () => {
      interface R {
        foo: number
        bar: number
        div: (n: number) => Either<Error, number>
      }

      const div: R['div'] = (n) =>
        0 === n ? either.left(Error()) : either.right(1138 / n)

      expect(
        $readerEither.picksEitherK<R>()('div', (div) => div(42))({ div }),
      ).toStrictEqual(either.right(1138 / 42))
    })
  })
})
