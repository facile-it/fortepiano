import * as E from 'fp-ts/Either';
import { Lazy } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import * as IOE from 'fp-ts/IOEither';
import * as Optio from 'fp-ts/Option';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
export declare const pick: <R extends object>() => <K extends keyof R>(k: K) => RTE.ReaderTaskEither<Pick<R, K>, never, Pick<R, K>[K]>;
export declare const picks: <R extends object>() => <K extends keyof R, E, B>(k: K, f: (r: Pick<R, K>[K]) => RTE.ReaderTaskEither<Pick<R, K>, E, B>) => RTE.ReaderTaskEither<Pick<R, K>, E, B>;
export declare const picksW: <R1 extends object>() => <K extends keyof R1, R2, E, B>(k: K, f: (r: Pick<R1, K>[K]) => RTE.ReaderTaskEither<R2, E, B>) => RTE.ReaderTaskEither<Pick<R1, K> & R2, E, B>;
export declare const picksOptionK: <R extends object>() => <E>(onNone: Lazy<E>) => <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => Optio.Option<B>) => RTE.ReaderTaskEither<Pick<R, K>, E, B>;
export declare const picksEitherK: <R extends object>() => <K extends keyof R, _E, B>(k: K, f: (r: Pick<R, K>[K]) => E.Either<_E, B>) => RTE.ReaderTaskEither<Pick<R, K>, _E, B>;
export declare const picksIOK: <R extends object>() => <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => IO.IO<B>) => RTE.ReaderTaskEither<Pick<R, K>, never, B>;
export declare const picksIOEitherK: <R extends object>() => <K extends keyof R, _E, B>(k: K, f: (r: Pick<R, K>[K]) => IOE.IOEither<_E, B>) => RTE.ReaderTaskEither<Pick<R, K>, _E, B>;
export declare const picksTaskK: <R extends object>() => <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => T.Task<B>) => RTE.ReaderTaskEither<Pick<R, K>, never, B>;
export declare const picksTaskEitherK: <R extends object>() => <K extends keyof R, _E, B>(k: K, f: (r: Pick<R, K>[K]) => TE.TaskEither<_E, B>) => RTE.ReaderTaskEither<Pick<R, K>, _E, B>;