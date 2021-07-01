import * as RTE from 'fp-ts/ReaderTaskEither'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { memoize as _memoize } from './function'
import * as $S from './struct'

const ERRORS = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
} as const

export type HttpMethod = 'delete' | 'get' | 'patch' | 'post' | 'put'

export interface HttpOptions {
  readonly body?: $S.struct
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

export interface HttpRequest2 {
  (url: string, options?: HttpOptions): TE.TaskEither<HttpError, HttpResponse>
}

export interface HttpRequest3<R> {
  (url: string, options?: HttpOptions): RTE.ReaderTaskEither<
    R,
    HttpError,
    HttpResponse
  >
}

export interface HttpClient2 {
  delete: HttpRequest2
  get: HttpRequest2
  patch: HttpRequest2
  post: HttpRequest2
  put: HttpRequest2
}

export interface HttpClient3<R> {
  delete: HttpRequest3<R>
  get: HttpRequest3<R>
  patch: HttpRequest3<R>
  post: HttpRequest3<R>
  put: HttpRequest3<R>
}

export const HttpResponseC = <C extends t.UnknownC>(codec: C) =>
  t.type(
    {
      url: t.string,
      statusCode: t.number,
      headers: t.readonly(
        t.record(t.string, t.union([t.string, t.readonlyArray(t.string)])),
      ),
      body: codec,
    },
    'HttpResponse',
  )

// const codec=t.intersection(
//   [ErrorC, t.type({ response: HttpResponseC(t.unknown) })],
//   'HttpError',
// )
// export const HttpErrorC = <A extends keyof typeof ERRORS>(type?: A) =>
//   codec.pipe(
//     new t.Type(
//       `Http${type}Error`,
// (u):u is HttpError & {
//   readonly response: HttpResponse & { readonly statusCode: typeof ERRORS[A] }
// }=>codec.is(u)&& ERRORS[type]=== u.response.statusCode,
// (e,c)=>,
// identity
//     )
//   )

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

// const isHttpError = (u: unknown): u is HttpError => u instanceof Error

// const isResponseError =
//   <A extends keyof typeof ERRORS>(type: A) =>
//   (
//     error: unknown,
//   ): error is HttpError & {
//     readonly response: HttpResponse & { readonly statusCode: typeof ERRORS[A] }
//   } =>
//     pipe(
//       error,
//       O.fromPredicate(isHttpError),
//       O.filter(t.type({ response: t.unknown }).is),
//       O.map($Optic.get('response')),
//       O.filter(({ statusCode }) => ERRORS[type] === statusCode),
//       $Optio.toBoolean,
//     )

// export const isBadRequest = isResponseError('BadRequest')
// export const isUnauthorized = isResponseError('Unauthorized')
// export const isForbidden = isResponseError('Forbidden')
// export const isNotFound = isResponseError('NotFound')
