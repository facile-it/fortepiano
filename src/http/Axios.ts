import { AxiosResponse, AxiosStatic } from 'axios'
import { either, readonlyRecord } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import * as $error from '../Error'
import { Http, HttpError, HttpMethod, HttpOptions, HttpResponse } from '../Http'
import * as $string from '../string'
import * as $taskEither from '../TaskEither'

const response =
  (url: string) =>
  (response: AxiosResponse): HttpResponse => ({
    url: response.config.url || url,
    status: response.status,
    headers: pipe(
      response.headers,
      t.readonly(t.record(t.string, t.unknown)).decode,
      either.map(
        readonlyRecord.filter(
          t.union([t.string, t.readonlyArray(t.string)]).is,
        ),
      ),
      either.getOrElse(() => ({})),
    ),
    body: response.data,
  })

const request = (
  axios: AxiosStatic,
  method: HttpMethod,
  url: string,
  options: HttpOptions = {},
) =>
  $taskEither.tryCatch(
    () =>
      axios
        .request({
          data: options.body,
          headers: {
            ...options.headers,
            ...(options.json ? { 'Content-Type': 'application/json' } : null),
          },
          method,
          params: options.query,
          // eslint-disable-next-line no-nested-ternary
          ...(options.json
            ? { responseType: 'json' }
            : options.buffer
            ? { responseType: 'arraybuffer' }
            : null),
          url,
        })
        .then(response(url))
        .catch((error) => {
          if (!axios.isAxiosError(error) || undefined === error.response) {
            throw error
          }

          throw $error.wrap(
            new HttpError(
              response(url)(error.response),
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

export const $axios = (_axios: AxiosStatic): Http => ({
  delete: (url, options) => request(_axios, 'delete', url, options),
  get: (url, options) => request(_axios, 'get', url, options),
  patch: (url, options) => request(_axios, 'patch', url, options),
  post: (url, options) => request(_axios, 'post', url, options),
  put: (url, options) => request(_axios, 'put', url, options),
  head: (url, options) => request(_axios, 'head', url, options),
  options: (url, options) => request(_axios, 'options', url, options),
})
