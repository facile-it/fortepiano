import * as Ei from 'fp-ts/Either'
import { constant, identity, pipe } from 'fp-ts/function'
import * as J from 'fp-ts/Json'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/Random'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { Json } from 'io-ts-types'
import * as $C from './Cache'
import * as $Er from './Error'
import { mock } from './http/Mock'
import * as $L from './Log'
import * as $R from './Random'
import * as $Stri from './string'
import * as $Stru from './struct'
import * as $T from './Type'

const ERRORS = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  UnprocessableEntity: 422,
} as const

export interface Http {
  readonly delete: HttpRequest<'body'>
  readonly get: HttpRequest<'body'>
  readonly patch: HttpRequest
  readonly post: HttpRequest
  readonly put: HttpRequest
  readonly head: HttpRequest<'body'>
  readonly options: HttpRequest<'body'>
}

export interface HttpResponse<A = unknown> {
  readonly url: string
  readonly status: number
  readonly headers: RR.ReadonlyRecord<string, string | ReadonlyArray<string>>
  readonly body: A
}

export class HttpError extends Error {
  constructor(readonly response: HttpResponse, message?: string) {
    super(message)
  }
}

export interface HttpOptions {
  readonly body?: $Stru.Struct | Buffer
  readonly headers?: RR.ReadonlyRecord<string, string>
  readonly json?: boolean
  readonly buffer?: boolean
  readonly query?: RR.ReadonlyRecord<string, boolean | number | string>
}

export interface HttpRequest<A extends keyof HttpOptions = never> {
  (url: string, options?: Omit<HttpOptions, A>): TE.TaskEither<
    Error | HttpError,
    HttpResponse
  >
}

const HttpMethods = [
  'delete',
  'get',
  'head',
  'options',
  'patch',
  'post',
  'put',
] as const
export const HttpMethodC = $T.literalUnion(HttpMethods, 'HttpMethod')
export type HttpMethod = t.TypeOf<typeof HttpMethodC>

export const HttpResponseC = <C extends t.Mixed>(codec: C) =>
  t.type(
    {
      url: t.string,
      status: t.number,
      headers: t.readonly(
        t.record(t.string, t.union([t.string, t.readonlyArray(t.string)])),
      ),
      body: codec,
    },
    `HttpResponse(${codec.name})`,
  )

const is =
  <A extends keyof typeof ERRORS>(type?: A) =>
  (u: unknown): u is HttpError =>
    $Er.ErrorC.is(u) &&
    t
      .type({
        response: t.intersection([
          HttpResponseC(t.unknown),
          t.type({ status: type ? t.literal(ERRORS[type]) : t.number }),
        ]),
      })
      .is({ ...u })

export const HttpErrorC = <A extends keyof typeof ERRORS>(type?: A) =>
  new t.Type(
    `Http${type || ''}Error`,
    is(type),
    (u, c) => (is(type)(u) ? t.success(u) : t.failure(u, c)),
    identity,
  )

const _json =
  (request: HttpRequest): HttpRequest =>
  (url, options) =>
    request(url, { ...options, json: true, buffer: false })

export const json = (http: Http): Http => ({
  delete: _json(http.delete),
  get: _json(http.get),
  patch: _json(http.patch),
  post: _json(http.post),
  put: _json(http.put),
  head: _json(http.head),
  options: _json(http.options),
})

const _buffer =
  (request: HttpRequest): HttpRequest =>
  (url, options) =>
    request(url, { ...options, buffer: true, json: false })

export const buffer = (http: Http): Http => ({
  delete: _buffer(http.delete),
  get: _buffer(http.get),
  patch: _buffer(http.patch),
  post: _buffer(http.post),
  put: _buffer(http.put),
  head: _buffer(http.head),
  options: _buffer(http.options),
})

export const cache =
  (cache: $C.Cache) =>
  (http: Http): Http => ({
    ...http,
    get: (url, options) =>
      pipe(
        [url, options] as const,
        J.stringify,
        Ei.match(
          () => http.get(url, options),
          (key) =>
            pipe(
              cache.get(key, HttpResponseC(t.unknown)),
              TE.alt(() =>
                pipe(
                  http.get(url, options),
                  TE.chainFirst((response) =>
                    pipe(
                      response as HttpResponse<J.Json>,
                      cache.set(key, HttpResponseC(Json)),
                      TE.altW(() => TE.of(undefined)),
                    ),
                  ),
                ),
              ),
            ),
        ),
      ),
  })

export const pool = (http: Http): Http => {
  const pool = new Map<
    Readonly<[string, HttpOptions | undefined]>,
    Promise<Ei.Either<Error | HttpError, HttpResponse>>
  >()

  return {
    ...http,
    get: (url, options) => {
      const key = [url, options] as const

      return pipe(
        pool.get(key),
        O.fromNullable,
        O.match(
          () => () => {
            const promise = http
              .get(url, options)()
              .finally(() => pool.delete(key))
            pool.set(key, promise)

            return promise
          },
          constant,
        ),
      )
    },
  }
}

const _log =
  (
    method: HttpMethod,
    request: HttpRequest,
    log: { start: $L.Logger; end: $L.Logger },
  ): HttpRequest =>
  (url, options) =>
    $R.salt(TE.MonadIO)(R.randomInt(0, Number.MAX_SAFE_INTEGER), (salt) => {
      const message = `[${salt}] \r${$Stri.uppercase(method)} ${url}`

      return pipe(
        log.start(message),
        TE.fromIO,
        TE.chain(() => request(url, options)),
        TE.chainFirstIOK(() => log.end(message)),
        TE.orElseW((error) =>
          pipe(
            log.end(message),
            TE.fromIO,
            TE.chain(() => TE.left(error)),
          ),
        ),
      )
    })

export const log =
  (logStart: $L.Logger, logEnd = $L.void) =>
  (http: Http): Http => ({
    delete: _log('delete', http.delete, { start: logStart, end: logEnd }),
    get: _log('get', http.get, { start: logStart, end: logEnd }),
    patch: _log('patch', http.patch, { start: logStart, end: logEnd }),
    post: _log('post', http.post, { start: logStart, end: logEnd }),
    put: _log('put', http.put, { start: logStart, end: logEnd }),
    head: _log('head', http.head, { start: logStart, end: logEnd }),
    options: _log('options', http.options, { start: logStart, end: logEnd }),
  })

export { mock }
