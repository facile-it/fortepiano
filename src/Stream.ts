import { identity } from 'fp-ts/function'
import * as t from 'io-ts'
import { Duplex, Readable, Writable } from 'stream'

const isReadable = (u: unknown): u is NodeJS.ReadableStream =>
  u instanceof Readable

export const ReadableStreamC = new t.Type(
  'ReadableStream',
  isReadable,
  (u, c) => (isReadable(u) ? t.success(u) : t.failure(u, c)),
  identity,
)

const isWritable = (u: unknown): u is NodeJS.WritableStream =>
  u instanceof Writable

export const WritableStreamC = new t.Type(
  'WritableStream',
  isWritable,
  (u, c) => (isWritable(u) ? t.success(u) : t.failure(u, c)),
  identity,
)

const isReadWrite = (u: unknown): u is NodeJS.ReadWriteStream =>
  u instanceof Duplex

export const ReadWriteStreamC = new t.Type(
  'ReadWriteStream',
  isReadWrite,
  (u, c) => (isReadWrite(u) ? t.success(u) : t.failure(u, c)),
  identity,
)
