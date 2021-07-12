import * as Ei from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { JsonFromString } from 'io-ts-types'
import { ClientOpts, RedisClient } from 'redis'
import * as $C from '../Cache'
import * as $Er from '../Error'

export const $redis = (config: ClientOpts, ttl = Infinity): $C.Cache => {
  const client = new RedisClient(config)

  return {
    get: (key, codec) =>
      pipe(
        TE.tryCatch(
          () =>
            new Promise<string>((resolve, reject) =>
              client.get(key, (error, result) => {
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
                client.set(
                  key,
                  JsonFromString.pipe(codec).encode(value),
                  'EX',
                  _ttl,
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
              client.del(key, (error, result) => {
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
            client.flushdb((error) =>
              null !== error ? reject(error) : resolve(),
            ),
          ),
        $Er.fromUnknown(Error('Cannot clear cache')),
      ),
    ),
  }
}
