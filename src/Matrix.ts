import { either, readonlyArray, readonlyRecord } from 'fp-ts'
import { constFalse, constNull, constTrue, pipe } from 'fp-ts/function'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'
import { ReadonlyRecord } from 'fp-ts/ReadonlyRecord'
import * as t from 'io-ts'
import * as tt from 'io-ts-types'
import * as $eq from './Eq'
import * as $readonlyArray from './ReadonlyArray'
import * as $readonlyRecord from './ReadonlyRecord'

interface MatrixBrand {
  readonly Matrix: unique symbol
}

export type Matrix<A> = t.Branded<
  ReadonlyArray<ReadonlyNonEmptyArray<A>>,
  MatrixBrand
>

const is =
  <C extends t.Mixed>(item: C) =>
  (u: unknown): u is Matrix<t.TypeOf<C>> =>
    pipe(
      u,
      t.readonlyArray(tt.readonlyNonEmptyArray(item)).decode,
      either.filterOrElseW(
        $readonlyArray.same($eq.getEqSize(readonlyArray)),
        constNull,
      ),
      either.match(constFalse, constTrue),
    )

export const MatrixC = <C extends t.Mixed>(item: C) =>
  t.brand(t.readonlyArray(tt.readonlyNonEmptyArray(item)), is(item), 'Matrix')

export const transpose = <A>(as: Matrix<A>): Matrix<A> =>
  pipe(
    as,
    readonlyArray.reduceWithIndex(
      {} as ReadonlyRecord<string, ReadonlyRecord<string, A>>,
      (i, bs, row) =>
        pipe(
          row,
          readonlyArray.reduceWithIndex(bs, (j, bs, a) => ({
            ...bs,
            [String(j)]: { ...bs[String(j)], [String(i)]: a },
          })),
        ),
    ),
    readonlyRecord.map($readonlyRecord.values),
    $readonlyRecord.values,
  ) as Matrix<A>
