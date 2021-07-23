/// <reference types="node" />
import * as TE from 'fp-ts/TaskEither';
export declare const randomBytes: (size: number) => TE.TaskEither<Error, Buffer>;
export declare const hash: (size: number, encoding?: BufferEncoding) => TE.TaskEither<Error, string>;
export declare const uuid4: TE.TaskEither<Error, string>;
