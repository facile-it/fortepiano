import { pipe } from 'fp-ts/function'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as TE from 'fp-ts/TaskEither'
import got from 'got'
import * as t from 'io-ts'
import * as $H from '../Http'

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
      }).then((response) => ({
        url: response.url,
        statusCode: response.statusCode,
        headers: pipe(response.headers, RR.filter(t.string.is)),
        body: options.json ? (response.body as any).data : response.body,
      })),
    () => Error(),
  )

export const $got: $H.HttpClient2 = {
  delete: (url, options) => request('delete', url, options),
  get: (url, options) => request('get', url, options),
  patch: (url, options) => request('patch', url, options),
  post: (url, options) => request('post', url, options),
  put: (url, options) => request('put', url, options),
}
