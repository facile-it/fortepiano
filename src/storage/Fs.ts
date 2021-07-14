import _fs from 'fs'
import _path from 'path'
import * as $E from '../Error'
import * as $S from '../Storage'
import * as $TE from '../TaskEither'

export const $fs = (fs: typeof _fs, root: string): $S.Storage => ({
  read: (path) =>
    $TE.tryCatch(
      () => fs.promises.readFile(_path.join(root, path)),
      $E.fromUnknown(Error(`Cannot read file "${path}"`)),
    ),
  write: (path) => (buffer) =>
    $TE.tryCatch(
      () => fs.promises.writeFile(_path.join(root, path), buffer),
      $E.fromUnknown(Error(`Cannot write file "${path}"`)),
    ),
  delete: (path) =>
    $TE.tryCatch(
      () => fs.promises.rm(_path.join(root, path)),
      $E.fromUnknown(Error(`Cannot delete file "${path}"`)),
    ),
})
