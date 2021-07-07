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
import * as IO from 'fp-ts/IO'
import * as MIO from 'fp-ts/MonadIO'

export function salt<M extends URIS4>(
  M: MIO.MonadIO4<M>,
): <S, R, E, A, B>(
  seed: IO.IO<A>,
  f: (salt: A) => Kind4<M, S, R, E, B>,
) => Kind4<M, S, R, E, B>
export function salt<M extends URIS3>(
  M: MIO.MonadIO3<M>,
): <R, E, A, B>(
  seed: IO.IO<A>,
  f: (salt: A) => Kind3<M, R, E, B>,
) => Kind3<M, R, E, B>
export function salt<M extends URIS2>(
  M: MIO.MonadIO2<M>,
): <E, A, B>(seed: IO.IO<A>, f: (salt: A) => Kind2<M, E, B>) => Kind2<M, E, B>
export function salt<M extends URIS>(
  M: MIO.MonadIO1<M>,
): <A, B>(seed: IO.IO<A>, f: (salt: A) => Kind<M, B>) => Kind<M, B>
export function salt<M>(M: MIO.MonadIO<M>) {
  return <A, B>(seed: IO.IO<A>, f: (salt: A) => HKT<M, B>) =>
    M.chain(M.fromIO(seed), f)
}
