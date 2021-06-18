import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

export const fromDate = (date: Date): O.Option<Date> =>
  isFinite(date as any) ? O.some(date) : O.none

export const fromString = (date: string): O.Option<Date> =>
  pipe(new Date(date), fromDate)

export const parse = (date: string): O.Option<number> =>
  pipe(date, Date.parse, O.of, O.filter(isFinite))
