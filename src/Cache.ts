import { constVoid, Endomorphism, pipe } from 'fp-ts/function'
import * as J from 'fp-ts/Json'
import * as R from 'fp-ts/Random'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { memory } from './cache/Memory'
import { storage } from './cache/Storage'
import * as $L from './Log'
import * as $R from './Random'

export interface Cache {
  readonly get: <A>(
    key: string,
    codec: t.Type<A, unknown>,
  ) => TE.TaskEither<Error, A>
  readonly set: <A>(
    key: string,
    codec: t.Type<A, J.Json>,
    ttl?: number,
  ) => (value: A) => TE.TaskEither<Error, void>
  readonly delete: (key: string) => TE.TaskEither<Error, void>
  readonly clear: TE.TaskEither<Error, void>
}

export const chain = (...caches: RNEA.ReadonlyNonEmptyArray<Cache>): Cache => ({
  get: (key, codec) =>
    pipe(
      caches,
      RNEA.reduce(TE.left(Error()), (value, { get }) =>
        TE.Alt.alt(value, () => get(key, codec)),
      ),
    ),
  set: (key, codec, ttl) => (value) =>
    pipe(
      caches,
      TE.traverseArray(({ set }) => set(key, codec, ttl)(value)),
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

// eslint-disable-next-line @typescript-eslint/unified-signatures
export function log(logStart: $L.Logger, logEnd: $L.Logger): Endomorphism<Cache>
export function log(log: $L.Logger): Endomorphism<Cache>
export function log(log0: $L.Logger, log1?: $L.Logger) {
  const logStart = undefined !== log1 ? log0 : $L.void
  const logEnd = log1 || log0

  return (cache: Cache): Cache => ({
    get: (key, codec) =>
      $R.salt(TE.MonadIO)(R.randomInt(0, Number.MAX_SAFE_INTEGER), (salt) =>
        pipe(
          logStart(`[${salt}] \rItem "${key}" retrieved from cache`),
          TE.fromIO,
          TE.chain(() => cache.get(key, codec)),
          TE.chainFirstIOK(() =>
            logEnd(`[${salt}] \rItem "${key}" retrieved from cache`),
          ),
        ),
      ),
    set: (key, codec, ttl) => (value) =>
      $R.salt(TE.MonadIO)(R.randomInt(0, Number.MAX_SAFE_INTEGER), (salt) =>
        pipe(
          logStart(`[${salt}] \rItem "${key}" saved to cache`),
          TE.fromIO,
          TE.chain(() => cache.set(key, codec, ttl)(value)),
          TE.chainFirstIOK(() =>
            logEnd(`[${salt}] \rItem "${key}" saved to cache`),
          ),
        ),
      ),
    delete: (key) =>
      $R.salt(TE.MonadIO)(R.randomInt(0, Number.MAX_SAFE_INTEGER), (salt) =>
        pipe(
          logStart(`[${salt}] \rItem "${key}" deleted from cache`),
          TE.fromIO,
          TE.chain(() => cache.delete(key)),
          TE.chainFirstIOK(() =>
            logEnd(`[${salt}] \rItem "${key}" deleted from cache`),
          ),
        ),
      ),
    clear: $R.salt(TE.MonadIO)(
      R.randomInt(0, Number.MAX_SAFE_INTEGER),
      (salt) =>
        pipe(
          logStart(`[${salt}] \rCache cleared`),
          TE.fromIO,
          TE.chain(() => cache.clear),
          TE.chainFirstIOK(() => logEnd(`[${salt}] \rCache cleared`)),
        ),
    ),
  })
}

export { memory, storage }
