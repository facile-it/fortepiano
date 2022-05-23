/* eslint-disable no-console */
import * as IO from 'fp-ts/IO'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as $S from './struct'

const _noArgs =
  (method: 'groupEnd'): IO.IO<void> =>
  () =>
    console[method]()

const _singleArg =
  (method: 'count' | 'countReset' | 'time' | 'timeEnd' | 'timeLog') =>
  (a?: unknown): IO.IO<void> =>
  () =>
    console[method](a as any)

const _multipleArgs =
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

export const error = _multipleArgs('error')
export const info = _multipleArgs('info')
export const log = _multipleArgs('log')
export const trace = _multipleArgs('trace')
export const warn = _multipleArgs('warn')

export const assert =
  (condition?: boolean, ...as: ReadonlyArray<unknown>): IO.IO<void> =>
  () =>
    console.assert(condition, ...as)

export const count = _singleArg('count')
export const countReset = _singleArg('countReset')

export const group = _multipleArgs('group')
export const groupCollapsed = _multipleArgs('groupCollapsed')
export const groupEnd = _noArgs('groupEnd')

export function table<A extends $S.Struct, K extends keyof A>(
  data: ReadonlyArray<A> | RR.ReadonlyRecord<string, A>,
  columns?: ReadonlyArray<K>,
): IO.IO<void>
export function table(data: $S.Struct | ReadonlyArray<unknown>): IO.IO<void>
export function table(
  a?: undefined | boolean | number | string,
  ...as: ReadonlyArray<unknown>
): IO.IO<void>
export function table(...args: ReadonlyArray<unknown>) {
  return () => console.table(...args)
}

export const time = _singleArg('time')
export const timeEnd = _singleArg('timeEnd')
export const timeLog = _singleArg('timeLog')
