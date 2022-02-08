import { pipe } from 'fp-ts/function'

const approx =
  (method: 'floor' | 'round' | 'ceil') =>
  (digits = 0, discardZeroSign = true) =>
  (a: number): number =>
    pipe(
      a.toString().split('e'),
      ([mantissa, exponent]) =>
        `${mantissa}e${(exponent ? Number(exponent) : 0) + digits}`,
      (s) => Math[method](Number(s)),
      (n) => n.toString().split('e'),
      ([mantissa, exponent]) =>
        `${mantissa}e${(exponent ? Number(exponent) : 0) - digits}`,
      Number,
      (n) => Math.sign(a) * Math.abs(n), // Helps when rounding -0.
      (n) => (n === 0 && discardZeroSign ? Math.abs(n) : n), // If true, -0 -> 0
    )

export const floor = approx('floor')
export const round = approx('round')
export const ceil = approx('ceil')
