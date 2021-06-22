import { pipe } from 'fp-ts/function'

const approx =
  (method: 'floor' | 'round' | 'ceil') =>
  (digits = 0) =>
  (a: number): number =>
    0 === a
      ? a
      : pipe(
          a,
          String,
          (x) => `${x}e+${Math.max(0, digits)}`,
          Number,
          (x) => Math[method](x),
          String,
          (x) => `${x}e-${Math.max(0, digits)}`,
          Number,
        )

export const floor = approx('floor')
export const round = approx('round')
export const ceil = approx('ceil')
