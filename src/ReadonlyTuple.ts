import { readonlyTuple } from 'fp-ts'
import {
  Applicative,
  Applicative1,
  Applicative2,
  Applicative2C,
  Applicative3,
  Applicative3C,
  Applicative4,
} from 'fp-ts/Applicative'
import { pipe } from 'fp-ts/function'
import {
  HKT,
  Kind,
  Kind2,
  Kind3,
  Kind4,
  URIS,
  URIS2,
  URIS3,
  URIS4,
} from 'fp-ts/HKT'

export const sequenceFst = readonlyTuple.sequence

export function sequenceSnd<F extends URIS4>(
  F: Applicative4<F>,
): <TE, S, R, FE, A>(
  ta: Readonly<[TE, Kind4<F, S, R, FE, A>]>,
) => Kind4<F, S, R, FE, Readonly<[TE, A]>>
export function sequenceSnd<F extends URIS3>(
  F: Applicative3<F>,
): <TE, R, FE, A>(
  ta: Readonly<[TE, Kind3<F, R, FE, A>]>,
) => Kind3<F, R, FE, Readonly<[TE, A]>>
export function sequenceSnd<F extends URIS3, FE>(
  F: Applicative3C<F, FE>,
): <TE, R, A>(
  ta: Readonly<[TE, Kind3<F, R, FE, A>]>,
) => Kind3<F, R, FE, Readonly<[TE, A]>>
export function sequenceSnd<F extends URIS2>(
  F: Applicative2<F>,
): <TE, FE, A>(
  ta: Readonly<[TE, Kind2<F, FE, A>]>,
) => Kind2<F, FE, Readonly<[TE, A]>>
export function sequenceSnd<F extends URIS2, FE>(
  F: Applicative2C<F, FE>,
): <TE, A>(
  ta: Readonly<[TE, Kind2<F, FE, A>]>,
) => Kind2<F, FE, Readonly<[TE, A]>>
export function sequenceSnd<F extends URIS>(
  F: Applicative1<F>,
): <TE, A>(ta: Readonly<[TE, Kind<F, A>]>) => Kind<F, Readonly<[TE, A]>>
export function sequenceSnd<F>(F: Applicative<F>) {
  return <TE, A>(ta: Readonly<[TE, HKT<F, A>]>) =>
    pipe(ta, readonlyTuple.swap, readonlyTuple.sequence(F), (fa) =>
      F.map(fa, readonlyTuple.swap),
    )
}

export const traverseFst = readonlyTuple.traverse

export function traverseSnd<F extends URIS3>(
  F: Applicative3<F>,
): <A, FR, FE, B>(
  f: (a: A) => Kind3<F, FR, FE, B>,
) => <TE>(ta: Readonly<[TE, A]>) => Kind3<F, FR, FE, Readonly<[TE, B]>>
export function traverseSnd<F extends URIS2>(
  F: Applicative2<F>,
): <A, FE, B>(
  f: (a: A) => Kind2<F, FE, B>,
) => <TE>(ta: Readonly<[TE, A]>) => Kind2<F, FE, Readonly<[TE, B]>>
export function traverseSnd<F extends URIS2, FE>(
  F: Applicative2C<F, FE>,
): <A, B>(
  f: (a: A) => Kind2<F, FE, B>,
) => <TE>(ta: Readonly<[TE, A]>) => Kind2<F, FE, Readonly<[TE, B]>>
export function traverseSnd<F extends URIS>(
  F: Applicative1<F>,
): <A, B>(
  f: (a: A) => Kind<F, B>,
) => <TE>(ta: Readonly<[TE, A]>) => Kind<F, Readonly<[TE, B]>>
export function traverseSnd<F>(F: Applicative<F>) {
  return <A, B>(f: (a: A) => HKT<F, B>) =>
    <TE>(ta: Readonly<[TE, A]>) =>
      pipe(ta, readonlyTuple.swap, readonlyTuple.traverse(F)(f), (fa) =>
        F.map(fa, readonlyTuple.swap),
      )
}
