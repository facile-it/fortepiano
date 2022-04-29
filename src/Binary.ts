import { Monoid } from 'fp-ts/Monoid'

export type Binary = 0 | 1

export const MonoidAnd: Monoid<Binary> = {
  empty: 1,
  concat: (x, y) => Number(Boolean(x) && Boolean(y)) as Binary,
}

export const MonoidOr: Monoid<Binary> = {
  empty: 0,
  concat: (x, y) => Number(Boolean(x) || Boolean(y)) as Binary,
}

export const MonoidXor: Monoid<Binary> = {
  empty: 0,
  concat: (x, y) => Number(x ? !y : Boolean(y)) as Binary,
}
