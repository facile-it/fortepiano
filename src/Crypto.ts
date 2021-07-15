import crypto from 'crypto'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as $E from './Error'

const HASH_SIZE = 16

export const hash = (
  encoding: BufferEncoding = 'hex',
  size = HASH_SIZE,
): TE.TaskEither<Error, string> =>
  pipe(
    TE.tryCatch<Error, Buffer>(
      () =>
        new Promise((resolve, reject) =>
          crypto.randomBytes(size, (error, buffer) =>
            null !== error ? reject(error) : resolve(buffer),
          ),
        ),
      $E.fromUnknown(Error('Cannot generate hash')),
    ),
    TE.map((buffer) => buffer.toString(encoding)),
  )
