import { option } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { Option } from 'fp-ts/Option'

export const fromDate = (date: Date): Option<Date> =>
  isFinite(date as any) ? option.some(date) : option.none

export const fromString = (date: string): Option<Date> =>
  pipe(new Date(date), fromDate)

export const parse = (date: string): Option<number> =>
  pipe(date, Date.parse, option.of, option.filter(isFinite))
