import { constTrue } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

export const toBoolean = <A>(ma: O.Option<A>): ma is O.Some<A> =>
  O.exists(constTrue)(ma)
