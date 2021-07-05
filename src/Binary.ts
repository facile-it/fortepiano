import * as M from 'fp-ts/Monoid'

export type Binary = 0 | 1

export const MonoidAnd: M.Monoid<Binary> = {
  empty: 1,
  concat: (x, y) => Number(Boolean(x) && Boolean(y)) as Binary,
}

export const MonoidOr: M.Monoid<Binary> = {
  empty: 0,
  concat: (x, y) => Number(Boolean(x) || Boolean(y)) as Binary,
}

export const MonoidXor: M.Monoid<Binary> = {
  empty: 0,
  concat: (x, y) => Number(x ? !y : Boolean(y)) as Binary,
}
