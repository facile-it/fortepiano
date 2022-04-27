import { either, json as _json, option, random, taskEither } from 'fp-ts'
import { Either } from 'fp-ts/Either'
import { constant, identity, pipe } from 'fp-ts/function'
import { Json } from 'fp-ts/Json'
import { ReadonlyRecord } from 'fp-ts/ReadonlyRecord'
import { TaskEither } from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import * as tt from 'io-ts-types'
import * as $cache from './Cache'
import * as $error from './Error'
import { mock } from './http/Mock'
import * as $log from './Log'
import * as $random from './Random'
import * as $string from './string'
import * as $struct from './struct'
import * as $type from './Type'

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
  readonly headers: ReadonlyRecord<string, string | ReadonlyArray<string>>
  readonly body: A
}

export class HttpError extends Error {
  constructor(readonly response: HttpResponse, message?: string) {
    super(message)
  }
}

export interface HttpOptions {
  readonly body?: $struct.struct | Buffer
  readonly headers?: ReadonlyRecord<string, string>
  readonly json?: boolean
  readonly buffer?: boolean
  readonly query?: ReadonlyRecord<string, boolean | number | string>
}

export interface HttpRequest<A extends keyof HttpOptions = never> {
  (url: string, options?: Omit<HttpOptions, A>): TaskEither<
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
export const HttpMethodC = $type.literalUnion(HttpMethods, 'HttpMethod')
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
    $error.ErrorC.is(u) &&
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

const __json =
  (request: HttpRequest): HttpRequest =>
  (url, options) =>
    request(url, { ...options, json: true, buffer: false })

export const json = (http: Http): Http => ({
  delete: __json(http.delete),
  get: __json(http.get),
  patch: __json(http.patch),
  post: __json(http.post),
  put: __json(http.put),
  head: __json(http.head),
  options: __json(http.options),
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
  (cache: $cache.Cache) =>
  (http: Http): Http => ({
    ...http,
    get: (url, options) =>
      pipe(
        [url, options] as const,
        _json.stringify,
        either.match(
          () => http.get(url, options),
          (key) =>
            pipe(
              cache.get(key, HttpResponseC(t.unknown)),
              taskEither.alt(() =>
                pipe(
                  http.get(url, options),
                  taskEither.chainFirst((response) =>
                    pipe(
                      response as HttpResponse<Json>,
                      cache.set(key, HttpResponseC(tt.Json)),
                      taskEither.altW(() => taskEither.of(undefined)),
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
    Promise<Either<Error | HttpError, HttpResponse>>
  >()

  return {
    ...http,
    get: (url, options) => {
      const key = [url, options] as const

      return pipe(
        pool.get(key),
        option.fromNullable,
        option.match(
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
    log: { start: $log.Logger; end: $log.Logger },
  ): HttpRequest =>
  (url, options) =>
    $random.salt(taskEither.MonadIO)(
      random.randomInt(0, Number.MAX_SAFE_INTEGER),
      (salt) => {
        const message = `[${salt}] \r${$string.uppercase(method)} ${url}`

        return pipe(
          log.start(message),
          taskEither.fromIO,
          taskEither.chain(() => request(url, options)),
          taskEither.chainFirstIOK(() => log.end(message)),
          taskEither.orElseW((error) =>
            pipe(
              log.end(message),
              taskEither.fromIO,
              taskEither.chain(() => taskEither.left(error)),
            ),
          ),
        )
      },
    )

export const log =
  (logStart: $log.Logger, logEnd = $log.void) =>
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
