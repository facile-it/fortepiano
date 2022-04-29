import { random, readonlyNonEmptyArray, taskEither } from 'fp-ts'
import { Endomorphism } from 'fp-ts/Endomorphism'
import { constVoid, pipe } from 'fp-ts/function'
import { Json } from 'fp-ts/Json'
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'
import { TaskEither } from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { memory } from './cache/Memory'
import { storage } from './cache/Storage'
import * as $log from './Log'
import { Logger } from './Log'
import * as $random from './Random'

export interface Cache {
  readonly get: <A>(
    key: string,
    codec: t.Type<A, unknown>,
  ) => TaskEither<Error, A>
  readonly set: <A>(
    key: string,
    codec: t.Type<A, Json>,
    ttl?: number,
  ) => (value: A) => TaskEither<Error, void>
  readonly delete: (key: string) => TaskEither<Error, void>
  readonly clear: TaskEither<Error, void>
}

export const chain = (...caches: ReadonlyNonEmptyArray<Cache>): Cache => ({
  get: (key, codec) =>
    pipe(
      caches,
      readonlyNonEmptyArray.reduce(taskEither.left(Error()), (value, { get }) =>
        taskEither.Alt.alt(value, () => get(key, codec)),
      ),
    ),
  set: (key, codec, ttl) => (value) =>
    pipe(
      caches,
      taskEither.traverseArray(({ set }) => set(key, codec, ttl)(value)),
      taskEither.map(constVoid),
    ),
  delete: (key) =>
    pipe(
      caches,
      taskEither.traverseArray(({ delete: _delete }) => _delete(key)),
      taskEither.map(constVoid),
    ),
  clear: pipe(
    caches,
    taskEither.traverseArray(({ clear }) => clear),
    taskEither.map(constVoid),
  ),
})

// eslint-disable-next-line @typescript-eslint/unified-signatures
export function log(logStart: Logger, logEnd: Logger): Endomorphism<Cache>
export function log(log: Logger): Endomorphism<Cache>
export function log(log0: Logger, log1?: Logger) {
  const logStart = undefined !== log1 ? log0 : $log.void
  const logEnd = log1 || log0

  return (cache: Cache): Cache => ({
    get: (key, codec) =>
      $random.salt(taskEither.MonadIO)(
        random.randomInt(0, Number.MAX_SAFE_INTEGER),
        (salt) =>
          pipe(
            logStart(`[${salt}] \rItem "${key}" retrieved from cache`),
            taskEither.fromIO,
            taskEither.chain(() => cache.get(key, codec)),
            taskEither.chainFirstIOK(() =>
              logEnd(`[${salt}] \rItem "${key}" retrieved from cache`),
            ),
          ),
      ),
    set: (key, codec, ttl) => (value) =>
      $random.salt(taskEither.MonadIO)(
        random.randomInt(0, Number.MAX_SAFE_INTEGER),
        (salt) =>
          pipe(
            logStart(`[${salt}] \rItem "${key}" saved to cache`),
            taskEither.fromIO,
            taskEither.chain(() => cache.set(key, codec, ttl)(value)),
            taskEither.chainFirstIOK(() =>
              logEnd(`[${salt}] \rItem "${key}" saved to cache`),
            ),
          ),
      ),
    delete: (key) =>
      $random.salt(taskEither.MonadIO)(
        random.randomInt(0, Number.MAX_SAFE_INTEGER),
        (salt) =>
          pipe(
            logStart(`[${salt}] \rItem "${key}" deleted from cache`),
            taskEither.fromIO,
            taskEither.chain(() => cache.delete(key)),
            taskEither.chainFirstIOK(() =>
              logEnd(`[${salt}] \rItem "${key}" deleted from cache`),
            ),
          ),
      ),
    clear: $random.salt(taskEither.MonadIO)(
      random.randomInt(0, Number.MAX_SAFE_INTEGER),
      (salt) =>
        pipe(
          logStart(`[${salt}] \rCache cleared`),
          taskEither.fromIO,
          taskEither.chain(() => cache.clear),
          taskEither.chainFirstIOK(() => logEnd(`[${salt}] \rCache cleared`)),
        ),
    ),
  })
}

export { memory, storage }
