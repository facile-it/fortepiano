import { taskEither } from 'fp-ts'
import _fs from 'fs'
import _path from 'path'
import * as $error from '../Error'
import { Storage } from '../Storage'
import * as $stream from '../Stream'
import * as $taskEither from '../TaskEither'

export const $fs = (fs: typeof _fs, root: string): Storage => ({
  getStream: (path) =>
    $taskEither.tryCatch(
      async () => fs.createReadStream(_path.join(root, path)),
      $error.fromUnknown(Error(`Cannot get stream for file "${path}"`)),
    ),
  getUrl: (path) => taskEither.left(Error(`Cannot get URL for file "${path}"`)),
  read: (path) =>
    $taskEither.tryCatch(
      () => fs.promises.readFile(_path.join(root, path)),
      $error.fromUnknown(Error(`Cannot read file "${path}"`)),
    ),
  write: (path) => (data) =>
    $taskEither.tryCatch(
      () =>
        $stream.ReadableStreamC.is(data)
          ? new Promise((resolve, reject) => {
              data
                .pipe(fs.createWriteStream(path).on('error', reject))
                .on('end', resolve)
            })
          : fs.promises.writeFile(_path.join(root, path), data),
      $error.fromUnknown(Error(`Cannot write file "${path}"`)),
    ),
  delete: (path) =>
    $taskEither.tryCatch(
      () => fs.promises.rm(_path.join(root, path)),
      $error.fromUnknown(Error(`Cannot delete file "${path}"`)),
    ),
})
