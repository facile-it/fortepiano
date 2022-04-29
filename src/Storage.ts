import { random, taskEither } from 'fp-ts'
import { flow, pipe } from 'fp-ts/function'
import { TaskEither } from 'fp-ts/TaskEither'
import * as $log from './Log'
import * as $random from './Random'
import * as $string from './string'

export interface Storage {
  readonly getStream: (
    path: string,
    options?: StorageOptions,
  ) => TaskEither<Error, NodeJS.ReadableStream>
  readonly getUrl: (
    path: string,
    options?: StorageOptions,
  ) => TaskEither<Error, string>
  readonly read: (
    path: string,
    options?: StorageOptions,
  ) => TaskEither<Error, Buffer>
  readonly write: (
    path: string,
    options?: StorageOptions,
  ) => (data: Buffer | NodeJS.ReadableStream) => TaskEither<Error, void>
  readonly delete: (
    path: string,
    options?: StorageOptions,
  ) => TaskEither<Error, void>
}

interface StorageOptions {
  readonly fileSystem?: string
}

const _log =
  (
    [verb, preposition]: Readonly<
      [
        (
          | 'getting stream for'
          | 'getting URL for'
          | 'reading'
          | 'writing'
          | 'deleting'
        ),
        'from' | 'to',
      ]
    >,
    path: string,
    { fileSystem }: StorageOptions,
    log: { start: $log.Logger; end: $log.Logger },
  ) =>
  <A>(ma: TaskEither<Error, A>): TaskEither<Error, A> =>
    $random.salt(taskEither.MonadIO)(
      random.randomInt(0, Number.MAX_SAFE_INTEGER),
      (salt) => {
        const message = `[${salt}] \r${$string.capitalize(
          verb,
        )} file "${path}"${
          undefined !== fileSystem
            ? ` ${preposition} file system "${fileSystem}"`
            : ''
        }`

        return pipe(
          log.start(message),
          taskEither.fromIO,
          taskEither.chain(() => ma),
          taskEither.chainFirstIOK(() => log.end(message)),
          taskEither.orElseW((error) =>
            pipe(
              log.end(message),
              taskEither.fromIO,
              taskEither.chain(() => taskEither.left(error)),
            ),
          ),
        )
      },
    )

export const log =
  (logStart: $log.Logger, logEnd = $log.void) =>
  (storage: Storage): Storage => ({
    getStream: (path, options = {}) =>
      pipe(
        storage.getStream(path, options),
        _log(['getting stream for', 'from'], path, options, {
          start: logStart,
          end: logEnd,
        }),
      ),
    getUrl: (path, options = {}) =>
      pipe(
        storage.getUrl(path, options),
        _log(['getting URL for', 'from'], path, options, {
          start: logStart,
          end: logEnd,
        }),
      ),
    read: (path, options = {}) =>
      pipe(
        storage.read(path, options),
        _log(['reading', 'from'], path, options, {
          start: logStart,
          end: logEnd,
        }),
      ),
    write: (path, options = {}) =>
      flow(
        storage.write(path, options),
        _log(['writing', 'to'], path, options, {
          start: logStart,
          end: logEnd,
        }),
      ),
    delete: (path, options = {}) =>
      pipe(
        storage.delete(path, options),
        _log(['deleting', 'from'], path, options, {
          start: logStart,
          end: logEnd,
        }),
      ),
  })
