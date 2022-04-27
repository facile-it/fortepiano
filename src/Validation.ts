import { applicative, either, readonlyArray } from 'fp-ts'
import { Either } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

export type Validation<E, A> = Either<ReadonlyArray<E>, A>

export const fromEither = <E, A>(fa: Either<E, A>): Validation<E, A> =>
  pipe(fa, either.mapLeft(readonlyArray.of))

export const getMonoid = <E>() =>
  applicative.getApplicativeMonoid(
    either.getApplicativeValidation(readonlyArray.getSemigroup<E>()),
  )
