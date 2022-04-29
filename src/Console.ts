/* eslint-disable no-console */
import { IO } from 'fp-ts/IO'
import { ReadonlyRecord } from 'fp-ts/ReadonlyRecord'
import { Struct } from './struct'

const _noArgs =
  (method: 'groupEnd'): IO<void> =>
  () =>
    console[method]()

const _singleArg =
  (method: 'count' | 'countReset' | 'time' | 'timeEnd' | 'timeLog') =>
  (a?: unknown): IO<void> =>
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
  (...as: ReadonlyArray<unknown>): IO<void> =>
  () =>
    console[method](...as)

export const error = _multipleArgs('error')
export const info = _multipleArgs('info')
export const log = _multipleArgs('log')
export const trace = _multipleArgs('trace')
export const warn = _multipleArgs('warn')

export const assert =
  (condition?: boolean, ...as: ReadonlyArray<unknown>): IO<void> =>
  () =>
    console.assert(condition, ...as)

export const count = _singleArg('count')
export const countReset = _singleArg('countReset')

export const group = _multipleArgs('group')
export const groupCollapsed = _multipleArgs('groupCollapsed')
export const groupEnd = _noArgs('groupEnd')

export function table<A extends Struct, K extends keyof A>(
  data: ReadonlyArray<A> | ReadonlyRecord<string, A>,
  columns?: ReadonlyArray<K>,
): IO<void>
export function table(data: Struct | ReadonlyArray<unknown>): IO<void>
export function table(
  a?: undefined | boolean | number | string,
  ...as: ReadonlyArray<unknown>
): IO<void>
export function table(...args: ReadonlyArray<unknown>) {
  return () => console.table(...args)
}

export const time = _singleArg('time')
export const timeEnd = _singleArg('timeEnd')
export const timeLog = _singleArg('timeLog')
