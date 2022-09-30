import { pipe } from 'fp-ts/function'
import * as RR from 'fp-ts/ReadonlyRecord'
import { collectWithIndex, values } from './ReadonlyRecord'

describe('ReadonlyRecord', () => {
  describe('collectWithIndex', () => {
    it('should resolve generic records into an array of indexed values', () => {
      ;(
        [
          [{}, []],
          [
            {
              key1: 'val1',
              key2: 'val2',
            },
            ['val1', 'val2'],
          ],
          [
            {
              key1_min: { something: 1 },
              key1_max: { something: 2 },
            },
            [{ something: 1 }, { something: 2 }],
          ],
          [
            {
              key1_min: { something: 1 },
              key1_max: { something: 2 },
              key2: 'key2',
              key3_max: { key3max: 10 },
              key3_min: { key3min: 0 },
            },
            [
              { something: 1 },
              { something: 2 },
              'key2',
              { key3max: 10 },
              { key3min: 0 },
            ],
          ],
          [
            {
              key1_min: null,
              key1_max: { something: 2 },
              key2_max: { key3max: 10 },
              key2_min: null,
            },
            [null, { something: 2 }, { key3max: 10 }, null],
          ],
        ] as Array<[any, Array<any>]>
      ).forEach(([record, expected]) =>
        expect(collectWithIndex((_, v) => v)(record)).toEqual(
          expected,
        ),
      )
    })
  })

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
