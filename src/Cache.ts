import { constVoid, pipe } from 'fp-ts/function'
import * as J from 'fp-ts/Json'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { memory } from './cache/Memory'
import { storage } from './cache/Storage'

export interface Cache {
  readonly get: {
    <C extends t.Mixed>(key: string, codec: C): TE.TaskEither<
      Error,
      t.TypeOf<C>
    >
    (key: string): TE.TaskEither<Error, unknown>
  }
  readonly set: (
    key: string,
    ttl?: number,
  ) => (value: J.Json) => TE.TaskEither<Error, void>
  readonly delete: (key: string) => TE.TaskEither<Error, void>
  readonly clear: TE.TaskEither<Error, void>
}

export type HasCache<K extends string = 'cache'> = RR.ReadonlyRecord<K, Cache>

export const chain = (...caches: RNEA.ReadonlyNonEmptyArray<Cache>): Cache => ({
  get: (key: string, codec = t.unknown) =>
    pipe(
      caches,
      RNEA.reduce(TE.left<Error, unknown>(Error()), (value, { get }) =>
        TE.Alt.alt(value, () => get(key, codec)),
      ),
    ),
  set: (key, ttl) => (value) =>
    pipe(
      caches,
      TE.traverseArray(({ set }) => set(key, ttl)(value)),
      TE.map(constVoid),
    ),
  delete: (key) =>
    pipe(
      caches,
      TE.traverseArray(({ delete: _delete }) => _delete(key)),
      TE.map(constVoid),
    ),
  clear: pipe(
    caches,
    TE.traverseArray(({ clear }) => clear),
    TE.map(constVoid),
  ),
})

export { memory, storage }
