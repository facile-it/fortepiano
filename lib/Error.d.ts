import * as t from 'io-ts';
export declare const ErrorC: t.Type<Error, Error, unknown>;
export declare const fromUnknown: (e: Error) => (u: unknown) => Error;
