import * as RR from 'fp-ts/ReadonlyRecord';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import * as $C from './Cache';
import { mock } from './http/Mock';
import * as $L from './Log';
import * as $Stru from './struct';
export declare type HttpMethod = 'delete' | 'get' | 'patch' | 'post' | 'put';
export interface HttpOptions {
    readonly body?: $Stru.struct;
    readonly headers?: RR.ReadonlyRecord<string, string>;
    readonly json?: boolean;
    readonly query?: RR.ReadonlyRecord<string, boolean | number | string>;
}
export interface HttpResponse<A = unknown> {
    readonly url: string;
    readonly statusCode: number;
    readonly headers: RR.ReadonlyRecord<string, string | ReadonlyArray<string>>;
    readonly body: A;
}
export declare type HttpError = Error | (Error & {
    readonly response: HttpResponse;
});
export interface HttpRequest<A extends keyof HttpOptions = never> {
    (url: string, options?: Omit<HttpOptions, A>): TE.TaskEither<HttpError, HttpResponse>;
}
export interface HttpClient {
    readonly delete: HttpRequest<'body'>;
    readonly get: HttpRequest<'body'>;
    readonly patch: HttpRequest;
    readonly post: HttpRequest;
    readonly put: HttpRequest;
}
export declare const HttpResponseC: <C extends t.Mixed>(codec: C) => t.TypeC<{
    url: t.StringC;
    statusCode: t.NumberC;
    headers: t.ReadonlyC<t.RecordC<t.StringC, t.UnionC<[t.StringC, t.ReadonlyArrayC<t.StringC>]>>>;
    body: C;
}>;
export declare const HttpErrorC: <A extends "BadRequest" | "Unauthorized" | "Forbidden" | "NotFound">(type?: A | undefined) => t.IntersectionC<[t.Type<Error, Error, unknown>, t.TypeC<{
    response: t.IntersectionC<[t.TypeC<{
        url: t.StringC;
        statusCode: t.NumberC;
        headers: t.ReadonlyC<t.RecordC<t.StringC, t.UnionC<[t.StringC, t.ReadonlyArrayC<t.StringC>]>>>;
        body: t.UnknownC;
    }>, t.TypeC<{
        statusCode: t.NumberC | t.LiteralC<{
            readonly BadRequest: 400;
            readonly Unauthorized: 401;
            readonly Forbidden: 403;
            readonly NotFound: 404;
        }[A]>;
    }>]>;
}>]>;
export declare const json: (client: HttpClient) => HttpClient;
export declare const cache: (cache: $C.Cache) => (client: HttpClient) => HttpClient;
export declare const log: (logger: $L.Logger) => (client: HttpClient) => HttpClient;
export { mock };
