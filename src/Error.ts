import * as t from 'io-ts'
import { failure } from 'io-ts/PathReporter'
import * as $S from './struct'

const is = (u: unknown): u is Error =>
  t
    .intersection([
      t.type({ name: t.string, message: t.string }),
      t.partial({ stack: t.string }),
    ])
    .is(u) || u instanceof Error

export const ErrorC = new t.Type(
  'Error',
  is,
  (u, c) => (is(u) ? t.success(u) : t.failure(u, c)),
  $S.lookup('message'),
)

export const fromUnknown = (e: Error) => (u: unknown) =>
  // eslint-disable-next-line no-nested-ternary
  ErrorC.is(u) ? u : t.string.is(u) ? Error(u) : e

const withPrev = (prev: Error) => (error: Error) => {
  ;(error as any).prev = prev

  return error
}

export const wrap =
  (e: Error) =>
  (u: unknown): Error & { readonly prev?: Error } => {
    try {
      // eslint-disable-next-line no-nested-ternary
      return ErrorC.is(u)
        ? withPrev(u)(e)
        : t.string.is(u)
        ? withPrev(Error(u))(e)
        : withPrev(Error(failure(e as any).join('\n')))(e)
    } catch (_) {
      return e
    }
  }
