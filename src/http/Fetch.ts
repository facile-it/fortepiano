import {
  either,
  json,
  option,
  readonlyArray,
  readonlyRecord,
  semigroup,
} from 'fp-ts'
import { constUndefined, pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import * as tt from 'io-ts-types'
import * as $error from '../Error'
import { Http, HttpError, HttpMethod, HttpOptions } from '../Http'
import * as $string from '../string'
import * as $taskEither from '../TaskEither'

const request = (
  _fetch: typeof fetch,
  method: HttpMethod,
  url: string,
  options: HttpOptions = {},
) =>
  $taskEither.tryCatch(
    () =>
      _fetch(
        pipe(
          options.query,
          option.fromNullable,
          option.map(readonlyRecord.map((value) => value.toString())),
          option.map((query) => new URLSearchParams(query)),
          option.map((params) => params.toString()),
          option.filter(tt.NonEmptyString.is),
          option.match(
            () => url,
            (queryString) => `${url}?${queryString}`,
          ),
        ),
        {
          // eslint-disable-next-line no-nested-ternary
          body: options.json
            ? pipe(
                options.body,
                json.stringify,
                either.getOrElseW(constUndefined),
              )
            : t.record(t.string, t.unknown).is(options.body)
            ? pipe(
                options.body,
                option.fromNullable,
                option.map(
                  readonlyRecord.reduceWithIndex(
                    new FormData(),
                    (name, form, value) => {
                      if (t.union([t.boolean, t.number, t.string]).is(value)) {
                        form.append(name, value.toString())
                      }

                      return form
                    },
                  ),
                ),
                option.getOrElseW(constUndefined),
              )
            : undefined,
          headers: {
            ...options.headers,
            ...(options.json ? { 'Content-Type': 'application/json' } : null),
          },
          method: $string.uppercase(method),
        },
      ).then((response) =>
        (response.ok && options.json ? response.json() : response.text()).then(
          (body) => {
            const _response = {
              url: response.url,
              status: response.status,
              headers: pipe(
                [...response.headers.entries()],
                readonlyRecord.fromFoldable(
                  semigroup.last<string>(),
                  readonlyArray.Foldable,
                ),
              ),
              body,
            }

            if (!response.ok) {
              throw new HttpError(
                _response,
                `Cannot make HTTP request "${$string.uppercase(
                  method,
                )} ${url}": ${response.statusText}`,
              )
            }

            return _response
          },
        ),
      ),
    $error.fromUnknown(
      Error(`Cannot make HTTP request "${$string.uppercase(method)} ${url}"`),
    ),
  )

export const $fetch = (_fetch: typeof fetch): Http => ({
  delete: (url, options) => request(_fetch, 'delete', url, options),
  get: (url, options) => request(_fetch, 'get', url, options),
  patch: (url, options) => request(_fetch, 'patch', url, options),
  post: (url, options) => request(_fetch, 'post', url, options),
  put: (url, options) => request(_fetch, 'put', url, options),
  head: (url, options) => request(_fetch, 'head', url, options),
  options: (url, options) => request(_fetch, 'options', url, options),
})
