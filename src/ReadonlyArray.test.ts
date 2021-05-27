import * as E from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as S from 'fp-ts/string'
import { allElems, anyElem, cartesian, same, words } from './ReadonlyArray'

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
  describe('cartesian', () => {
    it('should compute cartesian product of given arrays', () => {
      arrays.forEach(([[head, ...tail], output]) =>
        expect(cartesian(head, ...tail)).toStrictEqual(output),
      )
    })
  })

  describe('words', () => {
    it('should return no word for an empty alphabet', () => {
      expect(pipe([], words(1))).toStrictEqual([])
      expect(pipe([], words(2))).toStrictEqual([])
    })
    it('should support alphabets of one element', () => {
      expect(pipe([0], words(1))).toStrictEqual([[0]])
      expect(pipe([0], words(2))).toStrictEqual([[0, 0]])
    })
    it('should return words of specified sizes over the given alphabet', () => {
      const binary = [0, 1] as const
      /**
       * {@link https://en.wikipedia.org/wiki/Rock_paper_scissors#Additional_weapons}
       */
      const shapes = ['Rock', 'Paper', 'Scissors', 'Spock', 'Lizard'] as const
      const win = (a: number, b: number): boolean =>
        Boolean({ 1: true, 3: true }[(5 + a - b) % 5])

      expect(pipe(binary, words(1))).toStrictEqual([[0], [1]])
      expect(pipe(binary, words(2))).toStrictEqual([
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ])
      expect(pipe(binary, words(3))).toStrictEqual([
        [0, 0, 0],
        [0, 0, 1],
        [0, 1, 0],
        [0, 1, 1],
        [1, 0, 0],
        [1, 0, 1],
        [1, 1, 0],
        [1, 1, 1],
      ])
      expect(
        pipe(
          shapes,
          RA.mapWithIndex((i, a) => [i, a] as const),
          words(2),
          RA.filter(([[a], [b]]) => win(a, b)),
          RA.map(([[, a], [, b]]) => `${a} defeats ${b}`),
        ),
      ).toStrictEqual([
        'Rock defeats Scissors',
        'Rock defeats Lizard',
        'Paper defeats Rock',
        'Paper defeats Spock',
        'Scissors defeats Paper',
        'Scissors defeats Lizard',
        'Spock defeats Rock',
        'Spock defeats Scissors',
        'Lizard defeats Paper',
        'Lizard defeats Spock',
      ])
    })
    it('should support returning the empty word', () => {
      expect(pipe([0, 1], words(-Infinity))).toStrictEqual([[]])
    })
  })

  describe('allElems', () => {
    it('should return false when the array has no elements', () => {
      expect(allElems(S.Eq)('a')([])).toBe(false)
    })
    it('should return false when all elements are missing', () => {
      expect(allElems(S.Eq)('a')(['b'])).toBe(false)
    })
    it('should return false when some elements are missing', () => {
      expect(allElems(S.Eq)('a', 'b')(['a'])).toBe(false)
    })
    it('should return true when all elements are found', () => {
      expect(allElems(S.Eq)('a', 'b')(['b', 'a'])).toBe(true)
    })
    it('should return true when all elements are found along with others', () => {
      expect(allElems(S.Eq)('a', 'b')(['c', 'b', 'a'])).toBe(true)
    })
    it('should return true when duplicate elements are found', () => {
      expect(allElems(S.Eq)('a', 'a', 'b')(['b', 'b', 'a', 'a', 'a'])).toBe(
        true,
      )
    })
  })

  describe('anyElem', () => {
    it('should return false when the array has no elements', () => {
      expect(anyElem(S.Eq)('a')([])).toBe(false)
    })
    it('should return false when all elements are missing', () => {
      expect(anyElem(S.Eq)('a')(['b'])).toBe(false)
    })
    it('should return true when some elements are found', () => {
      expect(anyElem(S.Eq)('a', 'b')(['a'])).toBe(true)
    })
    it('should return true when all elements are found', () => {
      expect(anyElem(S.Eq)('a', 'b')(['b', 'a'])).toBe(true)
    })
    it('should return true when all elements are found along with others', () => {
      expect(anyElem(S.Eq)('a', 'b')(['c', 'b', 'a'])).toBe(true)
    })
    it('should return true when duplicate elements are found', () => {
      expect(anyElem(S.Eq)('a', 'a', 'b')(['b', 'b', 'a', 'a', 'a'])).toBe(true)
    })
  })

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
