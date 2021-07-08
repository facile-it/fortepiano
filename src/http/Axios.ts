import axios, { AxiosResponse } from 'axios'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import * as $E from '../Error'
import * as $H from '../Http'
import * as $S from '../string'

const response =
  (url: string) =>
  (response: AxiosResponse): $H.HttpResponse => ({
    url: response.config.url || url,
    statusCode: response.status,
    headers: pipe(
      response.headers,
      t.readonly(t.record(t.string, t.unknown)).decode,
      E.map(RR.filter(t.union([t.string, t.readonlyArray(t.string)]).is)),
      E.getOrElse(() => ({})),
    ),
    body: response.data,
  })

const request = (
  method: $H.HttpMethod,
  url: string,
  options: $H.HttpOptions = {},
) =>
  TE.tryCatch(
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
          ...(options.json ? { responseType: 'json' } : null),
          url,
        })
        .then(response(url))
        .catch((error) => {
          if (!axios.isAxiosError(error) || undefined === error.response) {
            throw error
          }

          throw {
            name: error.name,
            message: error.message,
            stack: error.stack,
            response: response(url)(error.response),
          }
        }),
    $E.fromUnknown(
      Error(`Cannot make HTTP request "${$S.uppercase(method)} ${url}"`),
    ),
  )

export const $axios: $H.HttpClient = {
  delete: (url, options) => request('delete', url, options),
  get: (url, options) => request('get', url, options),
  patch: (url, options) => request('patch', url, options),
  post: (url, options) => request('post', url, options),
  put: (url, options) => request('put', url, options),
}
