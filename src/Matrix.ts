import { either } from 'fp-ts'
import { constFalse, constNull, constTrue, pipe } from 'fp-ts/function'
import { ReadonlyRecord } from 'fp-ts/ReadonlyRecord'
import { readonlyRecord } from './ReadonlyRecord'
import * as t from 'io-ts'
import { readonlyNonEmptyArray } from 'io-ts-types'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'
import { readonlyArray } from './ReadonlyArray'

export type Matrix<A> = t.Branded<
  ReadonlyArray<ReadonlyNonEmptyArray<A>>,
  { readonly Matrix: unique symbol }
>

const is = <C extends t.Mixed>(item: C) => (
  u: unknown
): u is Matrix<t.TypeOf<C>> =>
  pipe(
    u,
    t.readonlyArray(readonlyNonEmptyArray(item)).decode,
    either.filterOrElseW(readonlyArray.same(readonlyArray.EqSize), constNull),
    either.match(constFalse, constTrue)
  )

export const MatrixC = <C extends t.Mixed>(item: C) =>
  t.brand(t.readonlyArray(readonlyNonEmptyArray(item)), is(item), 'Matrix')

const transpose = <A>(as: Matrix<A>): Matrix<A> =>
  pipe(
    as,
    readonlyArray.reduceWithIndex(
      {} as ReadonlyRecord<string, ReadonlyRecord<string, A>>,
      (i, bs, row) =>
        pipe(
          row,
          readonlyArray.reduceWithIndex(bs, (j, bs, a) => ({
            ...bs,
            ['' + j]: { ...bs['' + j], ['' + i]: a },
          }))
        )
    ),
    readonlyRecord.map(readonlyRecord.values),
    readonlyRecord.values
  ) as Matrix<A>

export const matrix = { transpose }
