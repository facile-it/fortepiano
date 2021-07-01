import * as t from 'io-ts'

export const ErrorC = t.intersection(
  [
    t.type({ name: t.string, message: t.string }),
    t.partial({ stack: t.string }),
  ],
  'Error',
)
