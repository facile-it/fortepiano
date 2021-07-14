import * as Ei from 'fp-ts/Either'
import { flow, Lazy, pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import Memcached from 'memcached'
import * as $C from '../Cache'
import * as $Er from '../Error'
import { memoize } from '../function'
import * as $TE from '../TaskEither'

export const $memcached = (
  memcached: Lazy<Memcached>,
  ttl = Infinity,
): $C.Cache => {
  const _memcached = memoize(memcached)

  return {
    get: (key, codec) =>
      pipe(
        $TE.tryCatch(
          () =>
            new Promise((resolve, reject) =>
              _memcached().get(key, (error, data) => {
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
          $TE.tryCatch(
            () =>
              new Promise((resolve, reject) =>
                _memcached().set(
                  key,
                  codec.encode(value),
                  _ttl / 1000,
                  (error) =>
                    // eslint-disable-next-line eqeqeq
                    undefined != error ? reject(error) : resolve(),
                ),
              ),
            $Er.fromUnknown(Error(`Cannot write cache item "${key}"`)),
          ),
        ),
    delete: (key) =>
      pipe(
        $TE.tryCatch(
          () =>
            new Promise((resolve, reject) =>
              _memcached().del(key, (error) => {
                // eslint-disable-next-line eqeqeq
                undefined != error ? reject(error) : resolve()
              }),
            ),
          $Er.fromUnknown(Error(`Cannot delete cache item "${key}"`)),
        ),
      ),
    clear: pipe(
      $TE.tryCatch(
        () =>
          new Promise((resolve, reject) =>
            _memcached().flush((error) =>
              // eslint-disable-next-line eqeqeq
              undefined != error ? reject(error) : resolve(),
            ),
          ),
        $Er.fromUnknown(Error('Cannot clear cache')),
      ),
    ),
  }
}
