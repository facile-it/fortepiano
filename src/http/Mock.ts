import { taskEither } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { run } from '../function'
import {
  Http,
  HttpError,
  HttpRequest,
  HttpResponse,
  HttpResponseC,
} from '../Http'
import * as $mock from '../Mock'

const response = (url: string, error = false): $mock.Mock<HttpResponse> =>
  $mock.struct({
    url: $mock.literal(url),
    status: error ? $mock.integer(300, 599) : $mock.integer(200, 299),
    headers: $mock.readonlyRecord(
      $mock.string,
      $mock.union($mock.string, $mock.readonlyArray($mock.string)),
    ),
    body: $mock.unknown(),
  })

const error = (url: string): $mock.Mock<Error | HttpError> =>
  $mock.struct({
    name: $mock.string,
    message: $mock.string,
    stack: $mock.string,
    response: $mock.nullable(response(url, true)),
  })

const request: HttpRequest = (url) =>
  pipe(
    $mock.union(error(url), response(url)),
    taskEither.fromIOK(run),
    taskEither.chain((mock) =>
      HttpResponseC(t.unknown).is(mock)
        ? taskEither.right<HttpError, HttpResponse>(mock)
        : taskEither.left(mock),
    ),
  )

export const mock: Http = {
  delete: request,
  get: request,
  patch: request,
  post: request,
  put: request,
  head: request,
  options: request,
}
