/// <reference types="node" />
import * as TE from 'fp-ts/TaskEither';
import * as $L from './Log';
export interface Storage {
    readonly getStream: (path: string, options?: StorageOptions) => TE.TaskEither<Error, NodeJS.ReadableStream>;
    readonly getUrl: (path: string, options?: StorageOptions) => TE.TaskEither<Error, string>;
    readonly read: (path: string, options?: StorageOptions) => TE.TaskEither<Error, Buffer>;
    readonly write: (path: string, options?: StorageOptions) => (data: Buffer | NodeJS.ReadableStream) => TE.TaskEither<Error, void>;
    readonly delete: (path: string, options?: StorageOptions) => TE.TaskEither<Error, void>;
}
interface StorageOptions {
    readonly fileSystem?: string;
}
export declare const log: (logStart: $L.Logger, logEnd?: $L.Logger) => (storage: Storage) => Storage;
export {};
