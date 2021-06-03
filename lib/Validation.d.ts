import * as E from 'fp-ts/Either';
export declare type Validation<E, A> = E.Either<ReadonlyArray<E>, A>;
export declare const fromEither: <E, A>(fa: E.Either<E, A>) => Validation<E, A>;
export declare const getMonoid: <E>() => <A>(M: import("fp-ts/lib/Monoid").Monoid<A>) => import("fp-ts/lib/Monoid").Monoid<E.Either<readonly E[], A>>;
