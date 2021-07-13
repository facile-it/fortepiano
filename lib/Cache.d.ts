import { Endomorphism } from 'fp-ts/function';
import * as J from 'fp-ts/Json';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { memory } from './cache/Memory';
import { storage } from './cache/Storage';
import * as $L from './Log';
export interface Cache {
    readonly get: <A>(key: string, codec: t.Type<A>) => TE.TaskEither<Error, A>;
    readonly set: <A>(key: string, codec: t.Type<A, J.Json>, ttl?: number) => (value: A) => TE.TaskEither<Error, void>;
    readonly delete: (key: string) => TE.TaskEither<Error, void>;
    readonly clear: TE.TaskEither<Error, void>;
}
export declare const chain: (...caches: RNEA.ReadonlyNonEmptyArray<Cache>) => Cache;
export declare function log(logStart: $L.Logger, logEnd: $L.Logger): Endomorphism<Cache>;
export declare function log(log: $L.Logger): Endomorphism<Cache>;
export { memory, storage };
