import * as D from 'fp-ts/Date'
import { constVoid, pipe } from 'fp-ts/function'
import * as J from 'fp-ts/Json'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { memory } from './cache/Memory'
import { storage } from './cache/Storage'
import * as $L from './Log'
import * as $MIO from './MonadIO'

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
  (end: $L.Logger, start = $L.void) =>
  (cache: Cache): Cache => ({
    get: (key: string, codec = t.unknown) =>
      $MIO.salt(TE.MonadIO)(D.now, (salt) =>
        pipe(
          start(`[${salt}] \rItem "${key}" retrieved from cache`),
          TE.fromIO,
          TE.chain(() => cache.get(key, codec)),
          TE.chainFirstIOK(() =>
            end(`[${salt}] \rItem "${key}" retrieved from cache`),
          ),
        ),
      ),
    set: (key, ttl) => (value) =>
      $MIO.salt(TE.MonadIO)(D.now, (salt) =>
        pipe(
          start(`[${salt}] \rItem "${key}" saved to cache`),
          TE.fromIO,
          TE.chain(() => cache.set(key, ttl)(value)),
          TE.chainFirstIOK(() =>
            end(`[${salt}] \rItem "${key}" saved to cache`),
          ),
        ),
      ),
    delete: (key) =>
      $MIO.salt(TE.MonadIO)(D.now, (salt) =>
        pipe(
          start(`[${salt}] \rItem "${key}" deleted from cache`),
          TE.fromIO,
          TE.chain(() => cache.delete(key)),
          TE.chainFirstIOK(() =>
            end(`[${salt}] \rItem "${key}" deleted from cache`),
          ),
        ),
      ),
    clear: $MIO.salt(TE.MonadIO)(D.now, (salt) =>
      pipe(
        start(`[${salt}] \rCache cleared`),
        TE.fromIO,
        TE.chain(() => cache.clear),
        TE.chainFirstIOK(() => end(`[${salt}] \rCache cleared`)),
      ),
    ),
  })

export { memory, storage }
