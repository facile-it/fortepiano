import * as E from 'fp-ts/Either'
import { constUndefined, pipe } from 'fp-ts/function'
import * as J from 'fp-ts/Json'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as S from 'fp-ts/Semigroup'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types'
import * as $H from '../Http'

const request = (
  method: $H.HttpMethod,
  url: string,
  options: $H.HttpOptions = {},
) =>
  TE.tryCatch(
    () =>
      fetch(
        pipe(
          options.query,
          O.fromNullable,
          O.map(RR.map((value) => value.toString())),
          O.map((query) => new URLSearchParams(query)),
          O.map((params) => params.toString()),
          O.filter(NonEmptyString.is),
          O.match(
            () => url,
            (queryString) => `${url}?${queryString}`,
          ),
        ),
        {
          // eslint-disable-next-line no-nested-ternary
          body: options.json
            ? pipe(options.body, J.stringify, E.getOrElseW(constUndefined))
            : t.record(t.string, t.unknown).is(options.body)
            ? pipe(
                options.body,
                O.fromNullable,
                O.map(
                  RR.reduceWithIndex(new FormData(), (name, form, value) => {
                    if (t.union([t.boolean, t.number, t.string]).is(value)) {
                      form.append(name, value.toString())
                    }

                    return form
                  }),
                ),
                O.getOrElseW(constUndefined),
              )
            : undefined,
          headers: {
            ...options.headers,
            ...(options.json ? { 'Content-Type': 'application/json' } : null),
          },
          method,
        },
      ).then((response) =>
        (options.json ? response.json() : response.text()).then((body) => ({
          url: response.url,
          statusCode: response.status,
          headers: pipe(
            [...response.headers.entries()],
            RR.fromFoldable(S.last<string>(), RA.Foldable),
          ),
          body,
        })),
      ),
    () => Error(),
  )

export const $fetch: $H.HttpClient2 = {
  delete: (url, options) => request('delete', url, options),
  get: (url, options) => request('get', url, options),
  patch: (url, options) => request('patch', url, options),
  post: (url, options) => request('post', url, options),
  put: (url, options) => request('put', url, options),
}
