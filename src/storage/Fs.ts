import * as TE from 'fp-ts/TaskEither'
import _fs from 'fs'
import _path from 'path'
import * as $E from '../Error'
import * as $Sto from '../Storage'
import * as $Str from '../Stream'
import * as $TE from '../TaskEither'

export const $fs = (fs: typeof _fs, root: string): $Sto.Storage => ({
  getStream: (path) =>
    $TE.tryCatch(
      async () => fs.createReadStream(_path.join(root, path)),
      $E.fromUnknown(Error(`Cannot get stream for file "${path}"`)),
    ),
  getUrl: (path) => TE.left(Error(`Cannot get URL for file "${path}"`)),
  read: (path) =>
    $TE.tryCatch(
      () => fs.promises.readFile(_path.join(root, path)),
      $E.fromUnknown(Error(`Cannot read file "${path}"`)),
    ),
  write: (path) => (data) =>
    $TE.tryCatch(
      () =>
        $Str.ReadableStreamC.is(data)
          ? new Promise((resolve, reject) => {
              data
                .pipe(fs.createWriteStream(path).on('error', reject))
                .on('end', resolve)
            })
          : fs.promises.writeFile(_path.join(root, path), data),
      $E.fromUnknown(Error(`Cannot write file "${path}"`)),
    ),
  delete: (path) =>
    $TE.tryCatch(
      () => fs.promises.rm(_path.join(root, path)),
      $E.fromUnknown(Error(`Cannot delete file "${path}"`)),
    ),
})
