import { pipe } from 'fp-ts/function'
import * as M from 'fp-ts/Magma'
import * as RA from 'fp-ts/ReadonlyArray'

export const concatAll =
  <A>(M: M.Magma<A>) =>
  (startWith: A) =>
  (as: ReadonlyArray<A>): A =>
    pipe(as, RA.reduce(startWith, M.concat))
