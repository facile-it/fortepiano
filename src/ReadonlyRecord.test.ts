import { pipe } from 'fp-ts/function'
import { ReadonlyRecord } from 'fp-ts/ReadonlyRecord'
import { readonlyRecord } from './ReadonlyRecord'

describe('ReadonlyRecord', () => {
  describe('values', () => {
    it('should return a list of record values', () => {
      const x: ReadonlyRecord<string, string> = {
        a: 'foo',
        b: 'bar',
        c: 'mad',
        d: 'max',
      }

      expect(pipe(x, readonlyRecord.values)).toStrictEqual([
        'foo',
        'bar',
        'mad',
        'max',
      ])
    })
  })
})
