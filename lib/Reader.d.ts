import * as R from 'fp-ts/Reader';
export declare const pick: <R extends object>() => <K extends keyof R>(k: K) => R.Reader<Pick<R, K>, Pick<R, K>[K]>;
export declare const picks: <R extends object>() => <K extends keyof R, B>(k: K, f: (r: Pick<R, K>[K]) => R.Reader<Pick<R, K>, B>) => R.Reader<Pick<R, K>, B>;
export declare const picksW: <R1 extends object>() => <K extends keyof R1, R2, B>(k: K, f: (r: Pick<R1, K>[K]) => R.Reader<R2, B>) => R.Reader<Pick<R1, K> & R2, B>;
