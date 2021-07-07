import * as J from 'fp-ts/Json';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { memory } from './cache/Memory';
import { storage } from './cache/Storage';
import * as $L from './Log';
export interface Cache {
    readonly get: {
        <C extends t.Mixed>(key: string, codec: C): TE.TaskEither<Error, t.TypeOf<C>>;
        (key: string): TE.TaskEither<Error, unknown>;
    };
    readonly set: (key: string, ttl?: number) => (value: J.Json) => TE.TaskEither<Error, void>;
    readonly delete: (key: string) => TE.TaskEither<Error, void>;
    readonly clear: TE.TaskEither<Error, void>;
}
export declare const chain: (...caches: RNEA.ReadonlyNonEmptyArray<Cache>) => Cache;
export declare const log: (end: $L.Logger, start?: $L.Logger) => (cache: Cache) => Cache;
export { memory, storage };
