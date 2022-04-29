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
import { IO } from 'fp-ts/IO'
import { MonadIO, MonadIO1, MonadIO2, MonadIO3, MonadIO4 } from 'fp-ts/MonadIO'

export function salt<M extends URIS4>(
  M: MonadIO4<M>,
): <S, R, E, A, B>(
  seed: IO<A>,
  f: (salt: A) => Kind4<M, S, R, E, B>,
) => Kind4<M, S, R, E, B>
export function salt<M extends URIS3>(
  M: MonadIO3<M>,
): <R, E, A, B>(
  seed: IO<A>,
  f: (salt: A) => Kind3<M, R, E, B>,
) => Kind3<M, R, E, B>
export function salt<M extends URIS2>(
  M: MonadIO2<M>,
): <E, A, B>(seed: IO<A>, f: (salt: A) => Kind2<M, E, B>) => Kind2<M, E, B>
export function salt<M extends URIS>(
  M: MonadIO1<M>,
): <A, B>(seed: IO<A>, f: (salt: A) => Kind<M, B>) => Kind<M, B>
export function salt<M>(M: MonadIO<M>) {
  return <A, B>(seed: IO<A>, f: (salt: A) => HKT<M, B>) =>
    M.chain(M.fromIO(seed), f)
}
