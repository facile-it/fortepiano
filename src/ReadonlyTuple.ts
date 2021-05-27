import * as A from 'fp-ts/Applicative'
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
import * as RT from 'fp-ts/ReadonlyTuple'

export const sequenceFst = RT.sequence

export function sequenceSnd<F extends URIS4>(
  F: A.Applicative4<F>,
): <TE, S, R, FE, A>(
  ta: Readonly<[TE, Kind4<F, S, R, FE, A>]>,
) => Kind4<F, S, R, FE, Readonly<[TE, A]>>
export function sequenceSnd<F extends URIS3>(
  F: A.Applicative3<F>,
): <TE, R, FE, A>(
  ta: Readonly<[TE, Kind3<F, R, FE, A>]>,
) => Kind3<F, R, FE, Readonly<[TE, A]>>
export function sequenceSnd<F extends URIS3, FE>(
  F: A.Applicative3C<F, FE>,
): <TE, R, A>(
  ta: Readonly<[TE, Kind3<F, R, FE, A>]>,
) => Kind3<F, R, FE, Readonly<[TE, A]>>
export function sequenceSnd<F extends URIS2>(
  F: A.Applicative2<F>,
): <TE, FE, A>(
  ta: Readonly<[TE, Kind2<F, FE, A>]>,
) => Kind2<F, FE, Readonly<[TE, A]>>
export function sequenceSnd<F extends URIS2, FE>(
  F: A.Applicative2C<F, FE>,
): <TE, A>(
  ta: Readonly<[TE, Kind2<F, FE, A>]>,
) => Kind2<F, FE, Readonly<[TE, A]>>
export function sequenceSnd<F extends URIS>(
  F: A.Applicative1<F>,
): <TE, A>(ta: Readonly<[TE, Kind<F, A>]>) => Kind<F, Readonly<[TE, A]>>
export function sequenceSnd<F>(F: A.Applicative<F>) {
  return <TE, A>(ta: Readonly<[TE, HKT<F, A>]>) =>
    pipe(ta, RT.swap, RT.sequence(F), (fa) => F.map(fa, RT.swap))
}

export const traverseFst = RT.traverse

export function traverseSnd<F extends URIS3>(
  F: A.Applicative3<F>,
): <A, FR, FE, B>(
  f: (a: A) => Kind3<F, FR, FE, B>,
) => <TE>(ta: Readonly<[TE, A]>) => Kind3<F, FR, FE, Readonly<[TE, B]>>
export function traverseSnd<F extends URIS2>(
  F: A.Applicative2<F>,
): <A, FE, B>(
  f: (a: A) => Kind2<F, FE, B>,
) => <TE>(ta: Readonly<[TE, A]>) => Kind2<F, FE, Readonly<[TE, B]>>
export function traverseSnd<F extends URIS2, FE>(
  F: A.Applicative2C<F, FE>,
): <A, B>(
  f: (a: A) => Kind2<F, FE, B>,
) => <TE>(ta: Readonly<[TE, A]>) => Kind2<F, FE, Readonly<[TE, B]>>
export function traverseSnd<F extends URIS>(
  F: A.Applicative1<F>,
): <A, B>(
  f: (a: A) => Kind<F, B>,
) => <TE>(ta: Readonly<[TE, A]>) => Kind<F, Readonly<[TE, B]>>
export function traverseSnd<F>(F: A.Applicative<F>) {
  return <A, B>(f: (a: A) => HKT<F, B>) =>
    <TE>(ta: Readonly<[TE, A]>) =>
      pipe(ta, RT.swap, RT.traverse(F)(f), (fa) => F.map(fa, RT.swap))
}
