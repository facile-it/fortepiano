import * as RTE from 'fp-ts/ReaderTaskEither';
import * as RR from 'fp-ts/ReadonlyRecord';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import * as $S from './struct';
export declare type HttpMethod = 'delete' | 'get' | 'patch' | 'post' | 'put';
export interface HttpOptions {
    readonly body?: $S.struct;
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
export interface HttpRequest2 {
    (url: string, options?: HttpOptions): TE.TaskEither<HttpError, HttpResponse>;
}
export interface HttpRequest3<R> {
    (url: string, options?: HttpOptions): RTE.ReaderTaskEither<R, HttpError, HttpResponse>;
}
export interface HttpClient2 {
    delete: HttpRequest2;
    get: HttpRequest2;
    patch: HttpRequest2;
    post: HttpRequest2;
    put: HttpRequest2;
}
export interface HttpClient3<R> {
    delete: HttpRequest3<R>;
    get: HttpRequest3<R>;
    patch: HttpRequest3<R>;
    post: HttpRequest3<R>;
    put: HttpRequest3<R>;
}
export declare const HttpResponseC: <C extends t.UnknownC>(codec: C) => t.TypeC<{
    url: t.StringC;
    statusCode: t.NumberC;
    headers: t.ReadonlyC<t.RecordC<t.StringC, t.UnionC<[t.StringC, t.ReadonlyArrayC<t.StringC>]>>>;
    body: C;
}>;
export declare const json: (client: HttpClient2) => HttpClient2;
export declare const memoize: (client: HttpClient2) => HttpClient2;
