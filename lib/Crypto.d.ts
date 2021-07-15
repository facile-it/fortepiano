/// <reference types="node" />
import * as TE from 'fp-ts/TaskEither';
export declare const hash: (encoding?: BufferEncoding, size?: number) => TE.TaskEither<Error, string>;
