/* eslint-disable no-console */
import * as IO from 'fp-ts/IO'

const _console =
  (method: 'log' | 'warn' | 'error' | 'info') =>
  (...as: ReadonlyArray<unknown>): IO.IO<void> =>
  () =>
    console[method](...as)

export const log = _console('log')
export const warn = _console('warn')
export const error = _console('error')
export const info = _console('info')
