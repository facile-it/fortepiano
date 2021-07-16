import * as t from 'io-ts'
import * as $E from './Error'
import * as $TE from './TaskEither'

const is = (u: unknown): u is Buffer => u instanceof Buffer

export const BufferC = new t.Type(
  'Buffer',
  is,
  (u, c) => (is(u) ? t.success(u) : t.failure(u, c)),
  (b) => b.toString('base64'),
)

export const BufferFromStringC = new t.Type(
  'BufferFromString',
  is,
  (u, c) => {
    try {
      return t.string.is(u)
        ? t.success(Buffer.from(u, 'base64'))
        : t.failure(u, c)
    } catch (_) {
      return t.failure(u, c)
    }
  },
  BufferC.encode,
)

export const fromStream = (stream: NodeJS.ReadableStream) =>
  $TE.tryCatch(
    () =>
      new Promise<Buffer>((resolve, reject) => {
        const buffer: Array<any> = []
        stream
          .on('error', reject)
          .on('data', (data) => buffer.push(data))
          .on('end', () => resolve(Buffer.concat(buffer)))
      }),
    $E.fromUnknown(Error('Cannot read stream into buffer')),
  )
