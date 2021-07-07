/* eslint-disable no-console */
import * as IO from 'fp-ts/IO'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as $S from './struct'

const _noArgs =
  (method: 'groupEnd'): IO.IO<void> =>
  () =>
    console[method]()

const _stringArg =
  (method: 'count' | 'countReset' | 'time' | 'timeEnd' | 'timeLog') =>
  (s: string): IO.IO<void> =>
  () =>
    console[method](s)

const _unknownArgs =
  (
    method:
      | 'error'
      | 'group'
      | 'groupCollapsed'
      | 'info'
      | 'log'
      | 'trace'
      | 'warn',
  ) =>
  (...as: ReadonlyArray<unknown>): IO.IO<void> =>
  () =>
    console[method](...as)

export const error = _unknownArgs('error')
export const info = _unknownArgs('info')
export const log = _unknownArgs('log')
export const trace = _unknownArgs('trace')
export const warn = _unknownArgs('warn')

export const assert =
  (condition?: boolean, ...as: ReadonlyArray<unknown>): IO.IO<void> =>
  () =>
    console.assert(condition, ...as)

export const count = _stringArg('count')
export const countReset = _stringArg('countReset')

export const group = _unknownArgs('group')
export const groupCollapsed = _unknownArgs('groupCollapsed')
export const groupEnd = _noArgs('groupEnd')

export function table<A extends $S.struct, K extends keyof A>(
  data: ReadonlyArray<A> | RR.ReadonlyRecord<string, A>,
  columns?: ReadonlyArray<K>,
): IO.IO<void>
export function table(data: $S.struct | ReadonlyArray<unknown>): IO.IO<void>
export function table(
  a?: undefined | boolean | number | string,
  ...as: ReadonlyArray<unknown>
): IO.IO<void>
export function table(...args: ReadonlyArray<unknown>) {
  return () => console.table(...args)
}

export const time = _stringArg('time')
export const timeEnd = _stringArg('timeEnd')
export const timeLog = _stringArg('timeLog')
