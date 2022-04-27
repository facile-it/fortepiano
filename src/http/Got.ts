import { readonlyRecord } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { Got, HTTPError } from 'got'
import * as t from 'io-ts'
import * as $error from '../Error'
import { Http, HttpError, HttpMethod, HttpOptions } from '../Http'
import * as $string from '../string'
import * as $taskEither from '../TaskEither'

const request = (
  _got: Got,
  method: HttpMethod,
  url: string,
  options: HttpOptions = {},
) =>
  $taskEither.tryCatch(
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
            readonlyRecord.filter(
              t.union([t.string, t.readonlyArray(t.string)]).is,
            ),
          ),
          body: response.body,
        }))
        .catch((error) => {
          if (!(error instanceof HTTPError)) {
            throw error
          }

          throw $error.wrap(
            new HttpError(
              {
                url: error.response.url,
                status: error.response.statusCode,
                headers: pipe(
                  error.response.headers,
                  readonlyRecord.filter(
                    t.union([t.string, t.readonlyArray(t.string)]).is,
                  ),
                ),
                body: error.response.body,
              },
              `Cannot make HTTP request "${$string.uppercase(
                method,
              )} ${url}": ${error.message}`,
            ),
          )(error)
        }),
    $error.fromUnknown(
      Error(`Cannot make HTTP request "${$string.uppercase(method)} ${url}"`),
    ),
  )

export const $got = (_got: Got): Http => ({
  delete: (url, options) => request(_got, 'delete', url, options),
  get: (url, options) => request(_got, 'get', url, options),
  patch: (url, options) => request(_got, 'patch', url, options),
  post: (url, options) => request(_got, 'post', url, options),
  put: (url, options) => request(_got, 'put', url, options),
  head: (url, options) => request(_got, 'head', url, options),
  options: (url, options) => request(_got, 'options', url, options),
})
