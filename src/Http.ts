import { pipe } from 'fp-ts/function'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import * as $E from './Error'
import { memoize as _memoize } from './function'
import { mock } from './http/Mock'
import * as $L from './Log'
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

export interface HttpRequest<A extends keyof HttpOptions = never> {
  (url: string, options?: Omit<HttpOptions, A>): TE.TaskEither<
    HttpError,
    HttpResponse
  >
}

export interface HttpClient {
  readonly delete: HttpRequest<'body'>
  readonly get: HttpRequest<'body'>
  readonly patch: HttpRequest
  readonly post: HttpRequest
  readonly put: HttpRequest
}

export type HasHttp<K extends string = 'http'> = RR.ReadonlyRecord<
  K,
  HttpClient
>

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
  (request: HttpRequest): HttpRequest =>
  (url, options) =>
    request(url, { ...options, json: true })

export const json = (client: HttpClient): HttpClient => ({
  delete: _json(client.get),
  get: _json(client.get),
  patch: _json(client.patch),
  post: _json(client.post),
  put: _json(client.post),
})

export const memoize = (client: HttpClient): HttpClient => ({
  ...client,
  get: _memoize((url, options) => {
    const promise = client.get(url, options)()

    return () => promise
  }),
})

const _log =
  (method: HttpMethod, request: HttpRequest, logger: $L.Logger): HttpRequest =>
  (url, options) =>
    pipe(
      logger(`${$Stri.uppercase(method)} ${url}`),
      TE.fromIO,
      TE.chain(() => request(url, options)),
    )

export const log = (client: HttpClient, logger: $L.Logger): HttpClient => ({
  delete: _log('delete', client.delete, logger),
  get: _log('get', client.get, logger),
  patch: _log('patch', client.patch, logger),
  post: _log('post', client.post, logger),
  put: _log('put', client.put, logger),
})

export { mock }
