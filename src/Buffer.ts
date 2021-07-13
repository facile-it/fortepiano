import { identity } from 'fp-ts/function'
import * as t from 'io-ts'

const is = (u: unknown): u is Buffer => u instanceof Buffer

export const BufferC = new t.Type(
  'Buffer',
  is,
  (u, c) => (is(u) ? t.success(u) : t.failure(u, c)),
  identity,
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
  (b) => b.toString('base64'),
)
