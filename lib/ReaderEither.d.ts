import * as E from 'fp-ts/Either';
import { Lazy } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RE from 'fp-ts/ReaderEither';
export declare const pick: <R extends object>() => <K extends keyof R>(k: K) => RE.ReaderEither<Pick<R, K>, never, Pick<R, K>[K]>;
export declare const picks: <R extends object>() => <K extends keyof R, E, B>(k: K, f: (r: Pick<R, K>[K]) => RE.ReaderEither<Pick<R, K>, E, B>) => RE.ReaderEither<Pick<R, K>, E, B>;
export declare const picksW: <R1 extends object>() => <K extends keyof R1, R2, E, B>(k: K, f: (r: Pick<R1, K>[K]) => RE.ReaderEither<R2, E, B>) => RE.ReaderEither<Pick<R1, K> & R2, E, B>;
export declare const picksOptionK: <R extends object>() => <E>(onNone: Lazy<E>) => <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => O.Option<B>) => RE.ReaderEither<Pick<R, K>, E, B>;
export declare const picksEitherK: <R extends object>() => <K extends keyof R, _E, B>(k: K, f: (r: Pick<R, K>[K]) => E.Either<_E, B>) => RE.ReaderEither<Pick<R, K>, _E, B>;
