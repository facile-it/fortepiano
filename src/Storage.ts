import { flow, pipe } from 'fp-ts/function'
import * as R from 'fp-ts/Random'
import * as TE from 'fp-ts/TaskEither'
import * as $L from './Log'
import * as $R from './Random'
import * as $Stri from './string'

export interface Storage {
  readonly getStream: (
    path: string,
    options?: StorageOptions,
  ) => TE.TaskEither<Error, NodeJS.ReadableStream>
  readonly getUrl: (
    path: string,
    options?: StorageOptions,
  ) => TE.TaskEither<Error, string>
  readonly read: (
    path: string,
    options?: StorageOptions,
  ) => TE.TaskEither<Error, Buffer>
  readonly write: (
    path: string,
    options?: StorageOptions,
  ) => (data: Buffer | NodeJS.ReadableStream) => TE.TaskEither<Error, void>
  readonly delete: (
    path: string,
    options?: StorageOptions,
  ) => TE.TaskEither<Error, void>
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
    log: { start: $L.Logger; end: $L.Logger },
  ) =>
  <A>(ma: TE.TaskEither<Error, A>): TE.TaskEither<Error, A> =>
    $R.salt(TE.MonadIO)(R.randomInt(0, Number.MAX_SAFE_INTEGER), (salt) => {
      const message = `[${salt}] \r${$Stri.capitalize(verb)} file "${path}"${
        undefined !== fileSystem
          ? ` ${preposition} file system "${fileSystem}"`
          : ''
      }`

      return pipe(
        log.start(message),
        TE.fromIO,
        TE.chain(() => ma),
        TE.chainFirstIOK(() => log.end(message)),
        TE.orElseW((error) =>
          pipe(
            log.end(message),
            TE.fromIO,
            TE.chain(() => TE.left(error)),
          ),
        ),
      )
    })

export const log =
  (logStart: $L.Logger, logEnd = $L.void) =>
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
