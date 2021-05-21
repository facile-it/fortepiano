import { pipe } from 'fp-ts/function'
import * as M from 'fp-ts/Magma'
import * as RA from 'fp-ts/ReadonlyArray'
import { concatAll } from './Magma'

describe('Magma', () => {
  describe('concatAll', () => {
    it('should concatenate values', () => {
      const M: M.Magma<ReadonlyArray<boolean>> = {
        concat: (x, y) =>
          pipe(
            [...x, ...y],
            RA.reduce([] as ReadonlyArray<boolean>, (b, a) =>
              pipe(
                b,
                RA.matchRight(
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
        concatAll(M)([false, false, false])([[true, false, true]]),
      ).toStrictEqual([true, false, true, false, true])
    })
  })
})
