import { StorageManager } from '@slynova/flydrive'
import { constVoid, Lazy, pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as $E from '../Error'
import { memoize } from '../function'
import * as $Sto from '../Storage'
import * as $Str from '../struct'
import * as $TE from '../TaskEither'

export const $flydrive = (flydrive: Lazy<StorageManager>): $Sto.Storage => {
  const _flydrive = memoize(flydrive)

  return {
    getStream: (path, { fileSystem } = {}) =>
      $TE.tryCatch(
        async () => _flydrive().disk(fileSystem).getStream(path),
        $E.fromUnknown(
          Error(
            `Cannot get stream for file "${path}"${
              undefined !== fileSystem ? ` on file system "${fileSystem}"` : ''
            }`,
          ),
        ),
      ),
    getUrl: (path, { fileSystem } = {}) =>
      pipe(
        $TE.tryCatch(
          () =>
            _flydrive()
              .disk(fileSystem)
              .exists(path)
              .then(({ exists }) =>
                exists ? Promise.resolve() : Promise.reject(),
              ),
          $E.fromUnknown(
            Error(
              `Cannot find file "${path}"${
                undefined !== fileSystem
                  ? ` on file system "${fileSystem}"`
                  : ''
              }`,
            ),
          ),
        ),
        TE.apSecond(
          $TE.tryCatch(
            () => Promise.resolve(_flydrive().disk(fileSystem).getUrl(path)),
            $E.fromUnknown(
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
      $TE.tryCatch(
        () =>
          _flydrive()
            .disk(fileSystem)
            .getBuffer(path)
            .then($Str.lookup('content')),
        $E.fromUnknown(
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
        $TE.tryCatch(
          () => _flydrive().disk(fileSystem).put(path, data).then(constVoid),
          $E.fromUnknown(
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
      $TE.tryCatch(
        () =>
          _flydrive()
            .disk(fileSystem)
            .delete(path)
            .then(({ wasDeleted }) =>
              false === wasDeleted ? Promise.reject() : Promise.resolve(),
            ),
        $E.fromUnknown(
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
