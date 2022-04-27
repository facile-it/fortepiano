import { readonlyArray } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { Magma } from 'fp-ts/Magma'

export const concatAll =
  <A>(M: Magma<A>) =>
  (startWith: A) =>
  (as: ReadonlyArray<A>): A =>
    pipe(as, readonlyArray.reduce(startWith, M.concat))
