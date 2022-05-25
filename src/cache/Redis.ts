import * as Ei from 'fp-ts/Either'
import { flow, Lazy, pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { JsonFromString } from 'io-ts-types'
import { RedisClient } from 'redis'
import * as $C from '../Cache'
import * as $Er from '../Error'
import { memoize } from '../function'
import * as $TE from '../TaskEither'

export const $redis = (redis: Lazy<RedisClient>, ttl = Infinity): $C.Cache => {
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
        $TE.tryCatch(
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
          $Er.fromUnknown(Error(`Cannot find cache item "${key}"`)),
        ),
        TE.chainEitherK(
          flow(
            JsonFromString.decode,
            Ei.chain(codec.decode),
            Ei.mapLeft(
              $Er.fromUnknown(
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
          $TE.tryCatch(
            () =>
              new Promise((resolve, reject) =>
                _redis()
                  .then((client) =>
                    client.set(
                      key,
                      JsonFromString.pipe(codec).encode(value),
                      'EX',
                      _ttl / 1000,
                      (error) => (null !== error ? reject(error) : resolve()),
                    ),
                  )
                  .catch(reject),
              ),
            $Er.fromUnknown(Error(`Cannot write cache item "${key}"`)),
          ),
        ),
    delete: (key) =>
      pipe(
        $TE.tryCatch(
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
          $Er.fromUnknown(Error(`Cannot delete cache item "${key}"`)),
        ),
      ),
    clear: pipe(
      $TE.tryCatch(
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
        $Er.fromUnknown(Error('Cannot clear cache')),
      ),
    ),
  }
}
