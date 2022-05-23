import { flow, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as t from 'io-ts'
import { failure } from 'io-ts/PathReporter'
import * as $S from './struct'

/**
 * @see https://tc39.es/proposal-promise-any/#sec-aggregate-error-objects
 */
export class AggregateError extends Error {
  constructor(readonly errors: ReadonlyArray<Error>, message?: string) {
    super(message)
  }
}

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
  (o) => pipe(o, $S.lookup('message')),
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

/**
 * @see https://tc39.es/proposal-error-cause/
 */
const withCause = (cause: Error) => (error: Error) => {
  ;(error as any).cause = cause
  // TODO: remove on 0.2.0.
  ;(error as any).prev = cause

  return error
}

export const wrap =
  (e: Error) =>
  (u: unknown): Error & { readonly cause?: Error } =>
    pipe(
      u,
      _fromUnknown,
      O.match(
        () => e,
        (error) => withCause(error)(e),
      ),
    )
