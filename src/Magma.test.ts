import { readonlyArray } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { Magma } from 'fp-ts/Magma'
import * as $magma from './Magma'

describe('Magma', () => {
  describe('concatAll', () => {
    it('should concatenate values', () => {
      const M: Magma<ReadonlyArray<boolean>> = {
        concat: (x, y) =>
          pipe(
            [...x, ...y],
            readonlyArray.reduce([] as ReadonlyArray<boolean>, (b, a) =>
              pipe(
                b,
                readonlyArray.matchRight(
                  () => [a],
                  (init, last) =>
                    false === last && false === a
                      ? [...init, true]
                      : [...init, last, a],
                ),
              ),
            ),
          ),
      }

      expect(
        $magma.concatAll(M)([false, false, false])([[true, false, true]]),
      ).toStrictEqual([true, false, true, false, true])
    })
  })
})
