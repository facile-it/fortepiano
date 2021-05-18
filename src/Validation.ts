import { applicative, either, readonlyArray } from 'fp-ts'
import { Either } from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'

export type Validation<E, A> = Either<ReadonlyArray<E>, A>

const fromEither = <E, A>(fa: Either<E, A>): Validation<E, A> =>
  pipe(fa, either.mapLeft(readonlyArray.of))

const getMonoid = <E>() =>
  applicative.getApplicativeMonoid(
    either.getApplicativeValidation(readonlyArray.getSemigroup<E>())
  )

export const validation = { fromEither, getMonoid }
