import { pipe } from 'fp-ts/function'
import * as RR from 'fp-ts/ReadonlyRecord'
import { Got, HTTPError } from 'got'
import * as t from 'io-ts'
import * as $E from '../Error'
import * as $H from '../Http'
import * as $S from '../string'
import * as $TE from '../TaskEither'

const request = (
  _got: Got,
  method: $H.HttpMethod,
  url: string,
  options: $H.HttpOptions = {},
) =>
  $TE.tryCatch(
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
          status: response.statusCode,
          headers: pipe(
            response.headers,
            RR.filter(t.union([t.string, t.readonlyArray(t.string)]).is),
          ),
          body: response.body,
        }))
        .catch((error) => {
          if (!(error instanceof HTTPError)) {
            throw error
          }

          throw $E.wrap(
            new $H.HttpError(
              {
                url: error.response.url,
                status: error.response.statusCode,
                headers: pipe(
                  error.response.headers,
                  RR.filter(t.union([t.string, t.readonlyArray(t.string)]).is),
                ),
                body: error.response.body,
              },
              `Cannot make HTTP request "${$S.uppercase(method)} ${url}": ${
                error.message
              }`,
            ),
          )(error)
        }),
    $E.fromUnknown(
      Error(`Cannot make HTTP request "${$S.uppercase(method)} ${url}"`),
    ),
  )

/**
 * @deprecated Use `$axios` instead
 */
export const $got = (_got: Got): $H.Http => ({
  delete: (url, options) => request(_got, 'delete', url, options),
  get: (url, options) => request(_got, 'get', url, options),
  patch: (url, options) => request(_got, 'patch', url, options),
  post: (url, options) => request(_got, 'post', url, options),
  put: (url, options) => request(_got, 'put', url, options),
  head: (url, options) => request(_got, 'head', url, options),
  options: (url, options) => request(_got, 'options', url, options),
})
