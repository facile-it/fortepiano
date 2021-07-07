import * as IO from 'fp-ts/IO';
import * as RR from 'fp-ts/ReadonlyRecord';
import * as $S from './struct';
export declare const error: (...as: ReadonlyArray<unknown>) => IO.IO<void>;
export declare const info: (...as: ReadonlyArray<unknown>) => IO.IO<void>;
export declare const log: (...as: ReadonlyArray<unknown>) => IO.IO<void>;
export declare const trace: (...as: ReadonlyArray<unknown>) => IO.IO<void>;
export declare const warn: (...as: ReadonlyArray<unknown>) => IO.IO<void>;
export declare const assert: (condition?: boolean | undefined, ...as: ReadonlyArray<unknown>) => IO.IO<void>;
export declare const count: (a?: unknown) => IO.IO<void>;
export declare const countReset: (a?: unknown) => IO.IO<void>;
export declare const group: (...as: ReadonlyArray<unknown>) => IO.IO<void>;
export declare const groupCollapsed: (...as: ReadonlyArray<unknown>) => IO.IO<void>;
export declare const groupEnd: IO.IO<void>;
export declare function table<A extends $S.struct, K extends keyof A>(data: ReadonlyArray<A> | RR.ReadonlyRecord<string, A>, columns?: ReadonlyArray<K>): IO.IO<void>;
export declare function table(data: $S.struct | ReadonlyArray<unknown>): IO.IO<void>;
export declare function table(a?: undefined | boolean | number | string, ...as: ReadonlyArray<unknown>): IO.IO<void>;
export declare const time: (a?: unknown) => IO.IO<void>;
export declare const timeEnd: (a?: unknown) => IO.IO<void>;
export declare const timeLog: (a?: unknown) => IO.IO<void>;
