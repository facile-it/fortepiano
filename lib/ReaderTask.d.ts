import * as IO from 'fp-ts/IO';
import * as RT from 'fp-ts/ReaderTask';
import * as T from 'fp-ts/Task';
export declare const pick: <R extends object>() => <K extends keyof R>(k: K) => RT.ReaderTask<Pick<R, K>, Pick<R, K>[K]>;
export declare const picks: <R extends object>() => <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => RT.ReaderTask<Pick<R, K>, B>) => RT.ReaderTask<Pick<R, K>, B>;
export declare const picksW: <R1 extends object>() => <K extends keyof R1, R2, B>(k: K, f: (r: Pick<R1, K>[K]) => RT.ReaderTask<R2, B>) => RT.ReaderTask<Pick<R1, K> & R2, B>;
export declare const picksIOK: <R extends object>() => <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => IO.IO<B>) => RT.ReaderTask<Pick<R, K>, B>;
export declare const picksTaskK: <R extends object>() => <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => T.Task<B>) => RT.ReaderTask<Pick<R, K>, B>;
