import * as IO from 'fp-ts/IO';
export declare const log: (...as: ReadonlyArray<unknown>) => IO.IO<void>;
export declare const warn: (...as: ReadonlyArray<unknown>) => IO.IO<void>;
export declare const error: (...as: ReadonlyArray<unknown>) => IO.IO<void>;
export declare const info: (...as: ReadonlyArray<unknown>) => IO.IO<void>;
