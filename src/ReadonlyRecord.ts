import { readonlyRecord as RR } from 'fp-ts'
import { Eq } from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import { ReadonlyRecord } from 'fp-ts/ReadonlyRecord'
import { readonlyArray } from './ReadonlyArray'

const values = <A>(as: ReadonlyRecord<string, A>): ReadonlyArray<A> =>
  Object.values(as)

/**
 * @see readonlyArray
 */
const same = <A>(E: Eq<A>) => (as: ReadonlyRecord<string, A>): boolean =>
  pipe(as, values, readonlyArray.same(E))

export const readonlyRecord = { ...RR, values, same }
