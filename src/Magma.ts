import { magma as M, readonlyArray } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { Magma } from 'fp-ts/Magma'

const concatAll = <A>(_M: Magma<A>) => (startWith: A) => (
  as: ReadonlyArray<A>
): A => pipe(as, readonlyArray.reduce(startWith, _M.concat))

export const magma = { ...M, concatAll }
