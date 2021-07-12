import { pipe } from 'fp-ts/function'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as TE from 'fp-ts/TaskEither'
import { Got, HTTPError } from 'got'
import * as t from 'io-ts'
import * as $E from '../Error'
import * as $H from '../Http'
import * as $S from '../string'

const request = (
  _got: Got,
  method: $H.HttpMethod,
  url: string,
  options: $H.HttpOptions = {},
) =>
  TE.tryCatch(
    () =>
      _got(url, {
        headers: options.headers,
        method,
        retry: 0,
        searchParams: options.query,
        ...(options.json
          ? { json: options.body, responseType: 'json' }
          : { form: options.body }),
      })
        .then((response) => ({
          url: response.url,
          statusCode: response.statusCode,
          headers: pipe(
            response.headers,
            RR.filter(t.union([t.string, t.readonlyArray(t.string)]).is),
          ),
          body: options.json
            ? ((response.body as any) || {}).data
            : response.body,
        }))
        .catch((error) => {
          if (!(error instanceof HTTPError)) {
            throw error
          }

          throw {
            name: error.name,
            message: error.message,
            stack: error.stack,
            response: {
              url: error.response.url,
              statusCode: error.response.statusCode,
              headers: pipe(
                error.response.headers,
                RR.filter(t.union([t.string, t.readonlyArray(t.string)]).is),
              ),
              body: error.response.body,
            },
          }
        }),
    $E.fromUnknown(
      Error(`Cannot make HTTP request "${$S.uppercase(method)} ${url}"`),
    ),
  )

export const got = (_got: Got): $H.HttpClient => ({
  delete: (url, options) => request(_got, 'delete', url, options),
  get: (url, options) => request(_got, 'get', url, options),
  patch: (url, options) => request(_got, 'patch', url, options),
  post: (url, options) => request(_got, 'post', url, options),
  put: (url, options) => request(_got, 'put', url, options),
})
