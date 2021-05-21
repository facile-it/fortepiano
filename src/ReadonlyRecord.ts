import * as E from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as $RA from './ReadonlyArray'

export const values = <A>(as: RR.ReadonlyRecord<string, A>): ReadonlyArray<A> =>
  Object.values(as)

export const same =
  <A>(E: E.Eq<A>) =>
  (as: RR.ReadonlyRecord<string, A>): boolean =>
    pipe(as, values, $RA.same(E))
