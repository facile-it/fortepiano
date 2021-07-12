import * as Ei from 'fp-ts/Either'
import { constant, pipe } from 'fp-ts/function'
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

export const HttpErrorC = <A extends keyof typeof ERRORS>(type?: A) =>
  t.intersection(
    [
      $Er.ErrorC,
      t.type({
        response: t.intersection([
          HttpResponseC(t.unknown),
          t.type({ statusCode: type ? t.literal(ERRORS[type]) : t.number }),
        ]),
      }),
    ],
    `Http${type || ''}Error`,
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

export const cache =
  (cache: $C.Cache) =>
  (client: HttpClient): HttpClient => ({
    ...client,
    get: (url, options) =>
      pipe(
        [url, options] as const,
        J.stringify,
        Ei.match(
          () => client.get(url, options),
          (key) =>
            pipe(
              cache.get(key, HttpResponseC(t.unknown)),
              TE.alt(() =>
                pipe(
                  client.get(url, options),
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

export const pool = (client: HttpClient): HttpClient => {
  const pool = new Map<
    Readonly<[string, HttpOptions | undefined]>,
    Promise<Ei.Either<HttpError, HttpResponse>>
  >()

  return {
    ...client,
    get: (url, options) => {
      const key = [url, options] as const

      return pipe(
        pool.get(key),
        O.fromNullable,
        O.match(
          () => () => {
            const promise = client
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
    $R.salt(TE.MonadIO)(R.randomInt(0, Number.MAX_SAFE_INTEGER), (salt) =>
      pipe(
        log.start(`[${salt}] \r${$Stri.uppercase(method)} ${url}`),
        TE.fromIO,
        TE.chain(() => request(url, options)),
        TE.chainFirstIOK(() =>
          log.end(`[${salt}] \r${$Stri.uppercase(method)} ${url}`),
        ),
        TE.orElseW((error) =>
          pipe(
            log.end(`[${salt}] \r${$Stri.uppercase(method)} ${url}`),
            TE.fromIO,
            TE.chain(() => TE.left(error)),
          ),
        ),
      ),
    )

export const log =
  (start: $L.Logger, end = $L.void) =>
  (client: HttpClient): HttpClient => ({
    delete: _log('delete', client.delete, { start, end }),
    get: _log('get', client.get, { start, end }),
    patch: _log('patch', client.patch, { start, end }),
    post: _log('post', client.post, { start, end }),
    put: _log('put', client.put, { start, end }),
  })

export { mock }
