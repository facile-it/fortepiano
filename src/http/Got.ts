import { pipe } from 'fp-ts/function'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as TE from 'fp-ts/TaskEither'
import got, { HTTPError } from 'got'
import * as t from 'io-ts'
import * as $E from '../Error'
import * as $H from '../Http'
import * as $S from '../string'

const request = (
  method: $H.HttpMethod,
  url: string,
  options: $H.HttpOptions = {},
) =>
  TE.tryCatch(
    () =>
      got(url, {
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
            ...error,
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
    (error) =>
      // eslint-disable-next-line no-nested-ternary
      $E.ErrorC.is(error)
        ? error
        : t.string.is(error)
        ? Error(error)
        : Error(`Cannot make HTTP request "${$S.uppercase(method)} ${url}"`),
  )

export const $got: $H.HttpClient2 = {
  delete: (url, options) => request('delete', url, options),
  get: (url, options) => request('get', url, options),
  patch: (url, options) => request('patch', url, options),
  post: (url, options) => request('post', url, options),
  put: (url, options) => request('put', url, options),
}
