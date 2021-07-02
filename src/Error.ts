import * as t from 'io-ts'

export const ErrorC = t.intersection(
  [
    t.type({ name: t.string, message: t.string }),
    t.partial({ stack: t.string }),
  ],
  'Error',
)

export const fromUnknown = (e: Error) => (u: unknown) =>
  // eslint-disable-next-line no-nested-ternary
  ErrorC.is(u) ? u : t.string.is(u) ? Error(u) : e
