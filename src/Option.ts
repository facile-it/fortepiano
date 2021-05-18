import { option as O } from 'fp-ts'
import { constTrue } from 'fp-ts/function'
import { Option, Some } from 'fp-ts/Option'

const toBoolean = <A>(ma: Option<A>): ma is Some<A> => O.exists(constTrue)(ma)

export const option = { ...O, toBoolean }
