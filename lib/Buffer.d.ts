/// <reference types="node" />
import * as t from 'io-ts';
export declare const BufferC: t.Type<Buffer, string, unknown>;
export declare const BufferFromStringC: t.Type<Buffer, string, unknown>;
export declare const fromStream: (stream: NodeJS.ReadableStream) => import("fp-ts/lib/TaskEither").TaskEither<Error, Buffer>;
