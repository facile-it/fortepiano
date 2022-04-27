/* eslint-disable no-bitwise */
import crypto from 'crypto'
import { taskEither } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { TaskEither } from 'fp-ts/TaskEither'
import * as $error from './Error'

export const randomBytes = (size: number): TaskEither<Error, Buffer> =>
  pipe(
    taskEither.tryCatch(
      () =>
        new Promise((resolve, reject) =>
          crypto.randomBytes(size, (error, buffer) =>
            null !== error ? reject(error) : resolve(buffer),
          ),
        ),
      $error.fromUnknown(Error(`Cannot generate ${size} random bytes`)),
    ),
  )

export const hash = (size: number, encoding: BufferEncoding = 'hex') =>
  pipe(
    randomBytes(size),
    taskEither.map((buffer) => buffer.toString(encoding)),
  )

export const uuid4 = pipe(
  hash(16, 'hex'),
  taskEither.map(
    (s) =>
      `${s.slice(0, 8)}-${s.slice(8, 12)}-4${s.slice(13, 16)}-${(
        ((s.charCodeAt(16) > 57
          ? s.charCodeAt(16) - 97
          : s.charCodeAt(16) - 48) &
          0x3) |
        0x8
      ).toString(16)}${s.slice(17, 20)}-${s.slice(20)}`,
  ),
)
