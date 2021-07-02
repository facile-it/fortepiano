import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { memory } from './cache/Memory';
import { storage } from './cache/Storage';
export interface Cache {
    readonly get: {
        <C extends t.Mixed>(key: string, codec: C): TE.TaskEither<Error, t.TypeOf<C>>;
        (key: string): TE.TaskEither<Error, unknown>;
    };
    readonly set: (key: string, value: unknown) => TE.TaskEither<Error, void>;
    readonly delete: (key: string) => TE.TaskEither<Error, void>;
    readonly clear: TE.TaskEither<Error, void>;
}
export { memory, storage };
