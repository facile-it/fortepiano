import * as t from 'io-ts'
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
