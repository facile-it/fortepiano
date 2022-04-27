import { either, taskEither } from 'fp-ts'
import { flow, Lazy, pipe } from 'fp-ts/function'
import * as tt from 'io-ts-types'
import { RedisClient } from 'redis'
import { Cache } from '../Cache'
import * as $error from '../Error'
import { memoize } from '../function'
import * as $taskEither from '../TaskEither'

export const $redis = (redis: Lazy<RedisClient>, ttl = Infinity): Cache => {
  const _redis = memoize(
    () =>
      new Promise<RedisClient>((resolve, reject) => {
        const client = redis()
        client.on('error', reject).on('ready', () => resolve(client))
      }),
  )

  return {
    get: (key, codec) =>
      pipe(
        $taskEither.tryCatch(
          () =>
            new Promise<string>((resolve, reject) =>
              _redis()
                .then((client) =>
                  client.get(key, (error, result) => {
                    null !== error || null === result
                      ? reject(error)
                      : resolve(result)
                  }),
                )
                .catch(reject),
            ),
          $error.fromUnknown(Error(`Cannot find cache item "${key}"`)),
        ),
        taskEither.chainEitherK(
          flow(
            codec.decode,
            either.mapLeft(
              $error.fromUnknown(
                Error(`Cannot decode cache item "${key}" into "${codec.name}"`),
              ),
            ),
          ),
        ),
      ),
    set:
      (key, codec, _ttl = ttl) =>
      (value) =>
        pipe(
          $taskEither.tryCatch(
            () =>
              new Promise((resolve, reject) =>
                _redis()
                  .then((client) =>
                    client.set(
                      key,
                      tt.JsonFromString.pipe(codec).encode(value),
                      'EX',
                      _ttl / 1000,
                      (error) => (null !== error ? reject(error) : resolve()),
                    ),
                  )
                  .catch(reject),
              ),
            $error.fromUnknown(Error(`Cannot write cache item "${key}"`)),
          ),
        ),
    delete: (key) =>
      pipe(
        $taskEither.tryCatch(
          () =>
            new Promise((resolve, reject) =>
              _redis()
                .then((client) =>
                  client.del(key, (error, result) => {
                    null !== error || null === result
                      ? reject(error)
                      : resolve()
                  }),
                )
                .catch(reject),
            ),
          $error.fromUnknown(Error(`Cannot delete cache item "${key}"`)),
        ),
      ),
    clear: pipe(
      $taskEither.tryCatch(
        () =>
          new Promise((resolve, reject) =>
            _redis()
              .then((client) =>
                client.flushdb((error) =>
                  null !== error ? reject(error) : resolve(),
                ),
              )
              .catch(reject),
          ),
        $error.fromUnknown(Error('Cannot clear cache')),
      ),
    ),
  }
}
