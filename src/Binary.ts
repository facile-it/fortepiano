import { Monoid } from 'fp-ts/Monoid'

export type Binary = 0 | 1

const MonoidOr: Monoid<Binary> = {
  empty: 0,
  concat: (x, y) => +(!!x || !!y) as Binary,
}

export const binary = { MonoidOr }
