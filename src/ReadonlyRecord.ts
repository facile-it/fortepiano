import { Eq } from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import { ReadonlyRecord } from 'fp-ts/ReadonlyRecord'
import * as $readonlyArray from './ReadonlyArray'

export const values = <A>(as: ReadonlyRecord<string, A>): ReadonlyArray<A> =>
  Object.values(as)

export const same =
  <A>(E: Eq<A>) =>
  (as: ReadonlyRecord<string, A>): boolean =>
    pipe(as, values, $readonlyArray.same(E))
