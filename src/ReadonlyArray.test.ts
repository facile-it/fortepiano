import * as E from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as S from 'fp-ts/string'
import { same } from './ReadonlyArray'

const arrays: ReadonlyArray<
  [
    RNEA.ReadonlyNonEmptyArray<ReadonlyArray<unknown>>,
    ReadonlyArray<ReadonlyArray<unknown>>,
  ]
> = [
  [[[]], []],
  [[[0, 1]], [[0], [1]]],
  [[[0, 1], []], []],
  [[[], ['a', 'b']], []],
  [
    [
      [0, 1],
      ['a', 'b'],
    ],
    [
      [0, 'a'],
      [0, 'b'],
      [1, 'a'],
      [1, 'b'],
    ],
  ],
  [
    [
      [0, 1],
      ['a', 'b'],
      [false, true],
    ],
    [
      [0, 'a', false],
      [0, 'a', true],
      [0, 'b', false],
      [0, 'b', true],
      [1, 'a', false],
      [1, 'a', true],
      [1, 'b', false],
      [1, 'b', true],
    ],
  ],
]

describe('ReadonlyArray', () => {
  describe('same', () => {
    it('should return true on empty arrays', () => {
      expect(same(S.Eq)([])).toBe(true)
    })
    it('should return true when there is a single element', () => {
      expect(same(S.Eq)(['a'])).toBe(true)
    })
    it('should return false when the elements differ', () => {
      expect(same(S.Eq)(['a', 'b'])).toBe(false)
    })
    it('should return true when all elements match', () => {
      interface User {
        name: string
        mother: string
        father: string
      }
      const eqParents: E.Eq<User> = pipe(
        E.tuple(S.Eq, S.Eq),
        E.contramap(({ mother, father }) => [mother, father] as const),
      )
      const siblings = same(eqParents)

      expect(same(S.Eq)(['a', 'a'])).toBe(true)
      expect(
        siblings([
          {
            name: 'Thomas',
            mother: 'Edith',
            father: 'Matthew',
          },
          {
            name: 'Thomas',
            mother: 'Edith',
            father: 'Richard',
          },
        ]),
      ).toBe(false)
      expect(
        siblings([
          {
            name: 'Thomas',
            mother: 'Edith',
            father: 'Matthew',
          },
          {
            name: 'William',
            mother: 'Edith',
            father: 'Matthew',
          },
        ]),
      ).toBe(true)
    })
  })
})
