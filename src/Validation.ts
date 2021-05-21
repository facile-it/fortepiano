import * as A from 'fp-ts/Applicative'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'

export type Validation<E, A> = E.Either<ReadonlyArray<E>, A>

export const fromEither = <E, A>(fa: E.Either<E, A>): Validation<E, A> =>
  pipe(fa, E.mapLeft(RA.of))

export const getMonoid = <E>() =>
  A.getApplicativeMonoid(E.getApplicativeValidation(RA.getSemigroup<E>()))
