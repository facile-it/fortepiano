import * as Ei from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import Memcached from 'memcached'
import * as $C from '../Cache'
import * as $Er from '../Error'

export const $memcached = (memcached: Memcached, ttl = Infinity): $C.Cache => ({
  get: (key, codec) =>
    pipe(
      TE.tryCatch(
        () =>
          new Promise((resolve, reject) =>
            memcached.get(key, (error, data) => {
              // eslint-disable-next-line eqeqeq
              undefined != error || undefined == data
                ? reject(error)
                : resolve(data)
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
              memcached.set(key, codec.encode(value), _ttl / 1000, (error) =>
                // eslint-disable-next-line eqeqeq
                undefined != error ? reject(error) : resolve(),
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
            memcached.del(key, (error) => {
              // eslint-disable-next-line eqeqeq
              undefined != error ? reject(error) : resolve()
            }),
          ),
        $Er.fromUnknown(Error(`Cannot delete cache item "${key}"`)),
      ),
    ),
  clear: pipe(
    TE.tryCatch(
      () =>
        new Promise((resolve, reject) =>
          memcached.flush((error) =>
            // eslint-disable-next-line eqeqeq
            undefined != error ? reject(error) : resolve(),
          ),
        ),
      $Er.fromUnknown(Error('Cannot clear cache')),
    ),
  ),
})
