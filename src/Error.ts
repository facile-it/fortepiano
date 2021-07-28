import { flow, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
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

const _fromUnknown = (u: unknown) => {
  try {
    // eslint-disable-next-line no-nested-ternary
    return ErrorC.is(u)
      ? O.some(u)
      : t.string.is(u)
      ? O.some(Error(u))
      : O.some(Error(failure(u as any).join('\n')))
  } catch (_) {
    return O.none
  }
}

export const fromUnknown = (e: Error) =>
  flow(
    _fromUnknown,
    O.getOrElse(() => e),
  )

const withPrev = (prev: Error) => (error: Error) => {
  ;(error as any).prev = prev

  return error
}

export const wrap =
  (e: Error) =>
  (u: unknown): Error & { readonly prev?: Error } =>
    pipe(
      u,
      _fromUnknown,
      O.match(
        () => e,
        (error) => withPrev(error)(e),
      ),
    )
