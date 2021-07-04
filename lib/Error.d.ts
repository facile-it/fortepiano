import * as t from 'io-ts';
export declare const ErrorC: t.IntersectionC<[t.TypeC<{
    name: t.StringC;
    message: t.StringC;
}>, t.PartialC<{
    stack: t.StringC;
}>]>;
export declare const fromUnknown: (e: Error) => (u: unknown) => Error;