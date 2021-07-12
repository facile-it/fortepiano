import * as Ei from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { JsonFromString } from 'io-ts-types'
import { RedisClient } from 'redis'
import * as $C from '../Cache'
import * as $Er from '../Error'

export const redis = (_redis: RedisClient, ttl = Infinity): $C.Cache => ({
  get: (key, codec) =>
    pipe(
      TE.tryCatch(
        () =>
          new Promise<string>((resolve, reject) =>
            _redis.get(key, (error, result) => {
              null !== error || null === result
                ? reject(error)
                : resolve(result)
            }),
          ),
        $Er.fromUnknown(Error(`Cannot find cache item "${key}"`)),
      ),
      TE.chainEitherK(
        flow(
          codec.decode,
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
        TE.tryCatch(
          () =>
            new Promise((resolve, reject) =>
              _redis.set(
                key,
                JsonFromString.pipe(codec).encode(value),
                'EX',
                _ttl / 1000,
                (error) => (null !== error ? reject(error) : resolve()),
              ),
            ),
          $Er.fromUnknown(Error(`Cannot write cache item "${key}"`)),
        ),
      ),
  delete: (key) =>
    pipe(
      TE.tryCatch(
        () =>
          new Promise((resolve, reject) =>
            _redis.del(key, (error, result) => {
              null !== error || null === result ? reject(error) : resolve()
            }),
          ),
        $Er.fromUnknown(Error(`Cannot delete cache item "${key}"`)),
      ),
    ),
  clear: pipe(
    TE.tryCatch(
      () =>
        new Promise((resolve, reject) =>
          _redis.flushdb((error) =>
            null !== error ? reject(error) : resolve(),
          ),
        ),
      $Er.fromUnknown(Error('Cannot clear cache')),
    ),
  ),
})
