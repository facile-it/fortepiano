import { either } from 'fp-ts'
import { constFalse, constNull, constTrue, pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'
import { ReadonlyRecord } from 'fp-ts/ReadonlyRecord'
import * as t from 'io-ts'
import { readonlyNonEmptyArray } from 'io-ts-types'
import * as $RA from './ReadonlyArray'
import { readonlyRecord } from './ReadonlyRecord'

export type Matrix<A> = t.Branded<
  ReadonlyArray<ReadonlyNonEmptyArray<A>>,
  { readonly Matrix: unique symbol }
>

const is =
  <C extends t.Mixed>(item: C) =>
  (u: unknown): u is Matrix<t.TypeOf<C>> =>
    pipe(
      u,
      t.readonlyArray(readonlyNonEmptyArray(item)).decode,
      either.filterOrElseW($RA.same($RA.EqSize), constNull),
      either.match(constFalse, constTrue),
    )

export const MatrixC = <C extends t.Mixed>(item: C) =>
  t.brand(t.readonlyArray(readonlyNonEmptyArray(item)), is(item), 'Matrix')

const transpose = <A>(as: Matrix<A>): Matrix<A> =>
  pipe(
    as,
    RA.reduceWithIndex(
      {} as ReadonlyRecord<string, ReadonlyRecord<string, A>>,
      (i, bs, row) =>
        pipe(
          row,
          RA.reduceWithIndex(bs, (j, _bs, a) => ({
            ..._bs,
            [String(j)]: { ..._bs[String(j)], [String(i)]: a },
          })),
        ),
    ),
    readonlyRecord.map(readonlyRecord.values),
    readonlyRecord.values,
  ) as Matrix<A>

export const matrix = { transpose }
