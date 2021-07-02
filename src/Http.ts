import { pipe } from 'fp-ts/function'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import * as $E from './Error'
import { memoize as _memoize } from './function'
import { mock } from './http/Mock'
import * as $L from './Log'
import * as $RTE from './ReaderTaskEither'
import * as $Stri from './string'
import * as $Stru from './struct'

const ERRORS = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
} as const

export type HttpMethod = 'delete' | 'get' | 'patch' | 'post' | 'put'

export interface HttpOptions {
  readonly body?: $Stru.struct
  readonly headers?: RR.ReadonlyRecord<string, string>
  readonly json?: boolean
  readonly query?: RR.ReadonlyRecord<string, boolean | number | string>
}

export interface HttpResponse<A = unknown> {
  readonly url: string
  readonly statusCode: number
  readonly headers: RR.ReadonlyRecord<string, string | ReadonlyArray<string>>
  readonly body: A
}

export type HttpError = Error | (Error & { readonly response: HttpResponse })

export interface HttpRequest2<A extends keyof HttpOptions = never> {
  (url: string, options?: Omit<HttpOptions, A>): TE.TaskEither<
    HttpError,
    HttpResponse
  >
}

export interface HttpRequest3<R, A extends keyof HttpOptions = never> {
  (url: string, options?: Omit<HttpOptions, A>): RTE.ReaderTaskEither<
    R,
    HttpError,
    HttpResponse
  >
}

export interface HttpClient2 {
  delete: HttpRequest2<'body'>
  get: HttpRequest2<'body'>
  patch: HttpRequest2
  post: HttpRequest2
  put: HttpRequest2
}

export interface HttpClient3<R> {
  delete: HttpRequest3<R, 'body'>
  get: HttpRequest3<R, 'body'>
  patch: HttpRequest3<R>
  post: HttpRequest3<R>
  put: HttpRequest3<R>
}

export interface HasHttp2 {
  readonly http: HttpClient2
}

export interface HasHttp3<R> {
  readonly http: HttpClient3<R>
}

export const HttpResponseC = <C extends t.Mixed>(codec: C) =>
  t.type(
    {
      url: t.string,
      statusCode: t.number,
      headers: t.readonly(
        t.record(t.string, t.union([t.string, t.readonlyArray(t.string)])),
      ),
      body: codec,
    },
    `HttpResponse(${codec.name})`,
  )

export const HttpErrorC = <A extends keyof typeof ERRORS>(type: A) =>
  t.intersection(
    [
      $E.ErrorC,
      t.type({
        response: t.intersection([
          HttpResponseC(t.unknown),
          t.type({ statusCode: t.literal(ERRORS[type]) }),
        ]),
      }),
    ],
    `Http${type}Error`,
  )

const _json =
  (request: HttpRequest2): HttpRequest2 =>
  (url, options) =>
    request(url, { ...options, json: true })

export const json = (client: HttpClient2): HttpClient2 => ({
  delete: _json(client.get),
  get: _json(client.get),
  patch: _json(client.patch),
  post: _json(client.post),
  put: _json(client.post),
})

export const memoize = (client: HttpClient2): HttpClient2 => ({
  ...client,
  get: _memoize((url, options) => {
    const promise = client.get(url, options)()

    return () => promise
  }),
})

const _log =
  (method: HttpMethod, request: HttpRequest2): HttpRequest3<$L.HasLog> =>
  (url, options) =>
    pipe(
      $RTE.picksIOK<$L.HasLog>()('log', ({ log }) =>
        log(`${$Stri.uppercase(method)} ${url}`),
      ),
      RTE.chainTaskEitherK(() => request(url, options)),
    )

export const log = (client: HttpClient2): HttpClient3<$L.HasLog> => ({
  delete: _log('delete', client.get),
  get: _log('get', client.get),
  patch: _log('patch', client.get),
  post: _log('post', client.get),
  put: _log('put', client.get),
})

export { mock }
