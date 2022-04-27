import { option } from 'fp-ts'
import { constTrue } from 'fp-ts/function'
import { Option, Some } from 'fp-ts/Option'

export const toBoolean = <A>(ma: Option<A>): ma is Some<A> =>
  option.exists(constTrue)(ma)
