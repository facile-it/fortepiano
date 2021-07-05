import { constVoid, flow, pipe } from 'fp-ts/function'
import * as J from 'fp-ts/Json'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { memory } from './cache/Memory'
import { storage } from './cache/Storage'
import * as $L from './Log'

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

export const log =
  (logger: $L.Logger) =>
  (cache: Cache): Cache => ({
    get: (key: string, codec = t.unknown) =>
      pipe(
        cache.get(key, codec),
        TE.chainFirstIOK(() => logger(`Item "${key}" retrieved from cache`)),
      ),
    set: (key: string, ttl) =>
      flow(
        cache.set(key, ttl),
        TE.chainFirstIOK(() => logger(`Item "${key}" saved to cache`)),
      ),
    delete: (key: string) =>
      pipe(
        cache.delete(key),
        TE.chainFirstIOK(() => logger(`Item "${key}" deleted from cache`)),
      ),
    clear: pipe(
      cache.clear,
      TE.chainFirstIOK(() => logger('Cache cleared')),
    ),
  })

export { memory, storage }
