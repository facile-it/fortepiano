import { StorageManager } from '@slynova/flydrive'
import { taskEither } from 'fp-ts'
import { constVoid, Lazy, pipe } from 'fp-ts/function'
import * as $error from '../Error'
import { memoize } from '../function'
import { Storage } from '../Storage'
import * as $struct from '../struct'
import * as $taskEither from '../TaskEither'

export const $flydrive = (flydrive: Lazy<StorageManager>): Storage => {
  const _flydrive = memoize(flydrive)

  return {
    getStream: (path, { fileSystem } = {}) =>
      $taskEither.tryCatch(
        async () => _flydrive().disk(fileSystem).getStream(path),
        $error.fromUnknown(
          Error(
            `Cannot get stream for file "${path}"${
              undefined !== fileSystem ? ` on file system "${fileSystem}"` : ''
            }`,
          ),
        ),
      ),
    getUrl: (path, { fileSystem } = {}) =>
      pipe(
        $taskEither.tryCatch(
          () =>
            _flydrive()
              .disk(fileSystem)
              .exists(path)
              .then(({ exists }) =>
                exists ? Promise.resolve() : Promise.reject(),
              ),
          $error.fromUnknown(
            Error(
              `Cannot find file "${path}"${
                undefined !== fileSystem
                  ? ` on file system "${fileSystem}"`
                  : ''
              }`,
            ),
          ),
        ),
        taskEither.apSecond(
          $taskEither.tryCatch(
            () => Promise.resolve(_flydrive().disk(fileSystem).getUrl(path)),
            $error.fromUnknown(
              Error(
                `Cannot get URL for file "${path}"${
                  undefined !== fileSystem
                    ? ` on file system "${fileSystem}"`
                    : ''
                }`,
              ),
            ),
          ),
        ),
      ),
    read: (path, { fileSystem } = {}) =>
      $taskEither.tryCatch(
        () =>
          _flydrive()
            .disk(fileSystem)
            .getBuffer(path)
            .then($struct.lookup('content')),
        $error.fromUnknown(
          Error(
            `Cannot read file "${path}"${
              undefined !== fileSystem
                ? ` from file system "${fileSystem}"`
                : ''
            }`,
          ),
        ),
      ),
    write:
      (path, { fileSystem } = {}) =>
      (data) =>
        $taskEither.tryCatch(
          () => _flydrive().disk(fileSystem).put(path, data).then(constVoid),
          $error.fromUnknown(
            Error(
              `Cannot write file "${path}"${
                undefined !== fileSystem
                  ? ` to file system "${fileSystem}"`
                  : ''
              }`,
            ),
          ),
        ),
    delete: (path, { fileSystem } = {}) =>
      $taskEither.tryCatch(
        () =>
          _flydrive()
            .disk(fileSystem)
            .delete(path)
            .then(({ wasDeleted }) =>
              false === wasDeleted ? Promise.reject() : Promise.resolve(),
            ),
        $error.fromUnknown(
          Error(
            `Cannot delete file "${path}"${
              undefined !== fileSystem
                ? ` from file system "${fileSystem}"`
                : ''
            }`,
          ),
        ),
      ),
  }
}
