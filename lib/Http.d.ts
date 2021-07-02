import * as RTE from 'fp-ts/ReaderTaskEither';
import * as RR from 'fp-ts/ReadonlyRecord';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
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
export interface HttpRequest2<A extends keyof HttpOptions = never> {
    (url: string, options?: Omit<HttpOptions, A>): TE.TaskEither<HttpError, HttpResponse>;
}
export interface HttpRequest3<R, A extends keyof HttpOptions = never> {
    (url: string, options?: Omit<HttpOptions, A>): RTE.ReaderTaskEither<R, HttpError, HttpResponse>;
}
export interface HttpClient2 {
    delete: HttpRequest2<'body'>;
    get: HttpRequest2<'body'>;
    patch: HttpRequest2;
    post: HttpRequest2;
    put: HttpRequest2;
}
export interface HttpClient3<R> {
    delete: HttpRequest3<R, 'body'>;
    get: HttpRequest3<R, 'body'>;
    patch: HttpRequest3<R>;
    post: HttpRequest3<R>;
    put: HttpRequest3<R>;
}
export interface HasHttp2 {
    readonly http: HttpClient2;
}
export interface HasHttp3<R> {
    readonly http: HttpClient3<R>;
}
export declare const HttpResponseC: <C extends t.Mixed>(codec: C) => t.TypeC<{
    url: t.StringC;
    statusCode: t.NumberC;
    headers: t.ReadonlyC<t.RecordC<t.StringC, t.UnionC<[t.StringC, t.ReadonlyArrayC<t.StringC>]>>>;
    body: C;
}>;
export declare const HttpErrorC: <A extends "BadRequest" | "Unauthorized" | "Forbidden" | "NotFound">(type: A) => t.IntersectionC<[t.IntersectionC<[t.TypeC<{
    name: t.StringC;
    message: t.StringC;
}>, t.PartialC<{
    stack: t.StringC;
}>]>, t.TypeC<{
    response: t.IntersectionC<[t.TypeC<{
        url: t.StringC;
        statusCode: t.NumberC;
        headers: t.ReadonlyC<t.RecordC<t.StringC, t.UnionC<[t.StringC, t.ReadonlyArrayC<t.StringC>]>>>;
        body: t.UnknownC;
    }>, t.TypeC<{
        statusCode: t.LiteralC<{
            readonly BadRequest: 400;
            readonly Unauthorized: 401;
            readonly Forbidden: 403;
            readonly NotFound: 404;
        }[A]>;
    }>]>;
}>]>;
export declare const json: (client: HttpClient2) => HttpClient2;
export declare const memoize: (client: HttpClient2) => HttpClient2;
export declare const log: (client: HttpClient2) => HttpClient3<$L.HasLog>;
export { mock };
