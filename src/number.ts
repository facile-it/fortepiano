import { pipe } from 'fp-ts/function'

const approx =
  (method: 'floor' | 'round' | 'ceil') =>
  (digits = 0) =>
  (a: number): number =>
    pipe(10 ** digits, (power) => Math[method](a * power) / power)

export const floor = approx('floor')
export const round = approx('round')
export const ceil = approx('ceil')
