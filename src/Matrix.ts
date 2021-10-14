import * as Ei from 'fp-ts/Either'
import { constFalse, constNull, constTrue, pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as t from 'io-ts'
import { readonlyNonEmptyArray } from 'io-ts-types'
import * as $Eq from './Eq'
import * as $RA from './ReadonlyArray'
import * as $RR from './ReadonlyRecord'

interface MatrixBrand {
  readonly Matrix: unique symbol
}

export type Matrix<A> = t.Branded<
  ReadonlyArray<RNEA.ReadonlyNonEmptyArray<A>>,
  MatrixBrand
>

const is =
  <C extends t.Mixed>(item: C) =>
  (u: unknown): u is Matrix<t.TypeOf<C>> =>
    pipe(
      u,
      t.readonlyArray(readonlyNonEmptyArray(item)).decode,
      Ei.filterOrElseW($RA.same($Eq.getEqSize(RA)), constNull),
      Ei.match(constFalse, constTrue),
    )

export const MatrixC = <C extends t.Mixed>(item: C) =>
  t.brand(t.readonlyArray(readonlyNonEmptyArray(item)), is(item), 'Matrix')

export const transpose = <A>(as: Matrix<A>): Matrix<A> =>
  pipe(
    as,
    RA.reduceWithIndex(
      {} as RR.ReadonlyRecord<string, RR.ReadonlyRecord<string, A>>,
      (i, bs, row) =>
        pipe(
          row,
          RA.reduceWithIndex(bs, (j, bs, a) => ({
            ...bs,
            [String(j)]: { ...bs[String(j)], [String(i)]: a },
          })),
        ),
    ),
    RR.map($RR.values),
    $RR.values,
  ) as Matrix<A>
