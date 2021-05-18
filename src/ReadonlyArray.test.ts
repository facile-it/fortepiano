import { eq, string } from 'fp-ts'
import { Eq } from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'
import { readonlyArray } from './ReadonlyArray'

const arrays: ReadonlyArray<
  [
    ReadonlyNonEmptyArray<ReadonlyArray<unknown>>,
    ReadonlyArray<ReadonlyArray<unknown>>
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
        expect(readonlyArray.cartesian(head, ...tail)).toStrictEqual(output)
      )
    })
  })

  describe('words', () => {
    it('should return no word for an empty alphabet', () => {
      expect(pipe([], readonlyArray.words(1))).toStrictEqual([])
      expect(pipe([], readonlyArray.words(2))).toStrictEqual([])
    })
    it('should support alphabets of one element', () => {
      expect(pipe([0], readonlyArray.words(1))).toStrictEqual([[0]])
      expect(pipe([0], readonlyArray.words(2))).toStrictEqual([[0, 0]])
    })
    it('should return words of specified sizes over the given alphabet', () => {
      const binary = [0, 1] as const
      /**
       * {@link https://en.wikipedia.org/wiki/Rock_paper_scissors#Additional_weapons}
       */
      const shapes = ['Rock', 'Paper', 'Scissors', 'Spock', 'Lizard'] as const
      const win = (a: number, b: number): boolean =>
        !!{ 1: true, 3: true }[(5 + a - b) % 5]

      expect(pipe(binary, readonlyArray.words(1))).toStrictEqual([[0], [1]])
      expect(pipe(binary, readonlyArray.words(2))).toStrictEqual([
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ])
      expect(pipe(binary, readonlyArray.words(3))).toStrictEqual([
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
          readonlyArray.mapWithIndex((i, a) => [i, a] as const),
          readonlyArray.words(2),
          readonlyArray.filter(([[a], [b]]) => win(a, b)),
          readonlyArray.map(([[, a], [, b]]) => `${a} defeats ${b}`)
        )
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
      expect(pipe([0, 1], readonlyArray.words(-Infinity))).toStrictEqual([[]])
    })
  })

  describe('allElems', () => {
    it('should return false when the array has no elements', () => {
      expect(readonlyArray.allElems(string.Eq)('a')([])).toBe(false)
    })
    it('should return false when all elements are missing', () => {
      expect(readonlyArray.allElems(string.Eq)('a')(['b'])).toBe(false)
    })
    it('should return false when some elements are missing', () => {
      expect(readonlyArray.allElems(string.Eq)('a', 'b')(['a'])).toBe(false)
    })
    it('should return true when all elements are found', () => {
      expect(readonlyArray.allElems(string.Eq)('a', 'b')(['b', 'a'])).toBe(true)
    })
    it('should return true when all elements are found along with others', () => {
      expect(readonlyArray.allElems(string.Eq)('a', 'b')(['c', 'b', 'a'])).toBe(
        true
      )
    })
    it('should return true when duplicate elements are found', () => {
      expect(
        readonlyArray.allElems(string.Eq)('a', 'a', 'b')([
          'b',
          'b',
          'a',
          'a',
          'a',
        ])
      ).toBe(true)
    })
  })

  describe('anyElem', () => {
    it('should return false when the array has no elements', () => {
      expect(readonlyArray.anyElem(string.Eq)('a')([])).toBe(false)
    })
    it('should return false when all elements are missing', () => {
      expect(readonlyArray.anyElem(string.Eq)('a')(['b'])).toBe(false)
    })
    it('should return true when some elements are found', () => {
      expect(readonlyArray.anyElem(string.Eq)('a', 'b')(['a'])).toBe(true)
    })
    it('should return true when all elements are found', () => {
      expect(readonlyArray.anyElem(string.Eq)('a', 'b')(['b', 'a'])).toBe(true)
    })
    it('should return true when all elements are found along with others', () => {
      expect(readonlyArray.anyElem(string.Eq)('a', 'b')(['c', 'b', 'a'])).toBe(
        true
      )
    })
    it('should return true when duplicate elements are found', () => {
      expect(
        readonlyArray.anyElem(string.Eq)('a', 'a', 'b')([
          'b',
          'b',
          'a',
          'a',
          'a',
        ])
      ).toBe(true)
    })
  })

  describe('same', () => {
    it('should return true on empty arrays', () => {
      expect(readonlyArray.same(string.Eq)([])).toBe(true)
    })
    it('should return true when there is a single element', () => {
      expect(readonlyArray.same(string.Eq)(['a'])).toBe(true)
    })
    it('should return false when the elements differ', () => {
      expect(readonlyArray.same(string.Eq)(['a', 'b'])).toBe(false)
    })
    it('should return true when all elements match', () => {
      type User = { name: string; mother: string; father: string }
      const eqParents: Eq<User> = pipe(
        eq.tuple(string.Eq, string.Eq),
        eq.contramap(({ mother, father }) => [mother, father] as const)
      )
      const siblings = readonlyArray.same(eqParents)

      expect(readonlyArray.same(string.Eq)(['a', 'a'])).toBe(true)
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
        ])
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
        ])
      ).toBe(true)
    })
  })

  describe('EqSize', () => {
    describe('equals', () => {
      it('should compare two arrays only by their size', () => {
        expect(readonlyArray.EqSize.equals([], [])).toBe(true)
        expect(readonlyArray.EqSize.equals([0], [])).toBe(false)
        expect(readonlyArray.EqSize.equals([], [0])).toBe(false)
        expect(readonlyArray.EqSize.equals([0], [0, 1])).toBe(false)
        expect(readonlyArray.EqSize.equals([0, 1, 2], [0, 1, 2])).toBe(true)
        expect(readonlyArray.EqSize.equals([0, 1, 2], ['a', 'b', 'c'])).toBe(
          true
        )
        // eslint-disable-next-line no-sparse-arrays
        expect(readonlyArray.EqSize.equals([0, 1, 2], [, , ,])).toBe(true)
      })
    })
  })
})
