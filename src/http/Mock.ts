import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { run } from '../function'
import * as $H from '../Http'
import * as $M from '../Mock'

const response = (url: string, error = false): $M.Mock<$H.HttpResponse> =>
  $M.struct({
    url: $M.literal(url),
    status: error ? $M.integer(300, 599) : $M.integer(200, 299),
    headers: $M.readonlyRecord(
      $M.string,
      $M.union($M.string, $M.readonlyArray($M.string)),
    ),
    body: $M.unknown(),
  })

const error = (url: string): $M.Mock<Error | $H.HttpError> =>
  $M.struct({
    name: $M.string,
    message: $M.string,
    stack: $M.string,
    response: $M.nullable(response(url, true)),
  })

const request: $H.HttpRequest = (url) =>
  pipe(
    $M.union(error(url), response(url)),
    TE.fromIOK(run),
    TE.chain((mock) =>
      $H.HttpResponseC(t.unknown).is(mock)
        ? TE.right<$H.HttpError, $H.HttpResponse>(mock)
        : TE.left(mock),
    ),
  )

export const mock: $H.Http = {
  delete: request,
  get: request,
  patch: request,
  post: request,
  put: request,
  head: request,
  options: request,
}
