import { pipe } from 'fp-ts/function'
import * as RR from 'fp-ts/ReadonlyRecord'
import { values } from './ReadonlyRecord'

describe('ReadonlyRecord', () => {
  describe('values', () => {
    it('should return a list of record values', () => {
      const x: RR.ReadonlyRecord<string, string> = {
        a: 'foo',
        b: 'bar',
        c: 'mad',
        d: 'max',
      }

      expect(pipe(x, values)).toStrictEqual(['foo', 'bar', 'mad', 'max'])
    })
  })
})
