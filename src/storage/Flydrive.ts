import { StorageManager } from '@slynova/flydrive'
import { constVoid } from 'fp-ts/function'
import * as $E from '../Error'
import * as $Sto from '../Storage'
import * as $Str from '../struct'
import * as $TE from '../TaskEither'

export const $flydrive = (flydrive: StorageManager): $Sto.Storage => ({
  read: (path, { fileSystem } = {}) =>
    $TE.tryCatch(
      () =>
        flydrive.disk(fileSystem).getBuffer(path).then($Str.lookup('content')),
      $E.fromUnknown(
        Error(
          `Cannot read file "${path}"${
            undefined !== fileSystem ? ` from file system "${fileSystem}"` : ''
          }`,
        ),
      ),
    ),
  write:
    (path, { fileSystem } = {}) =>
    (buffer) =>
      $TE.tryCatch(
        () => flydrive.disk(fileSystem).put(path, buffer).then(constVoid),
        $E.fromUnknown(
          Error(
            `Cannot write file "${path}"${
              undefined !== fileSystem ? ` to file system "${fileSystem}"` : ''
            }`,
          ),
        ),
      ),
  delete: (path, { fileSystem } = {}) =>
    $TE.tryCatch(
      () =>
        flydrive
          .disk(fileSystem)
          .delete(path)
          .then(({ wasDeleted }) =>
            true !== wasDeleted ? Promise.reject() : Promise.resolve(),
          ),
      $E.fromUnknown(
        Error(
          `Cannot delete file "${path}"${
            undefined !== fileSystem ? ` from file system "${fileSystem}"` : ''
          }`,
        ),
      ),
    ),
})
