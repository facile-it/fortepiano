import { either, taskEither } from 'fp-ts'
import { flow, Lazy, pipe } from 'fp-ts/function'
import Memcached from 'memcached'
import { Cache } from '../Cache'
import * as $error from '../Error'
import { memoize } from '../function'
import * as $taskEither from '../TaskEither'

export const $memcached = (
  memcached: Lazy<Memcached>,
  ttl = Infinity,
): Cache => {
  const _memcached = memoize(memcached)

  return {
    get: (key, codec) =>
      pipe(
        $taskEither.tryCatch(
          () =>
            new Promise((resolve, reject) =>
              _memcached().get(key, (error, data) => {
                // eslint-disable-next-line eqeqeq
                undefined != error || undefined == data
                  ? reject(error)
                  : resolve(data)
              }),
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
                _memcached().set(
                  key,
                  codec.encode(value),
                  _ttl / 1000,
                  (error) =>
                    // eslint-disable-next-line eqeqeq
                    undefined != error ? reject(error) : resolve(),
                ),
              ),
            $error.fromUnknown(Error(`Cannot write cache item "${key}"`)),
          ),
        ),
    delete: (key) =>
      pipe(
        $taskEither.tryCatch(
          () =>
            new Promise((resolve, reject) =>
              _memcached().del(key, (error) => {
                // eslint-disable-next-line eqeqeq
                undefined != error ? reject(error) : resolve()
              }),
            ),
          $error.fromUnknown(Error(`Cannot delete cache item "${key}"`)),
        ),
      ),
    clear: pipe(
      $taskEither.tryCatch(
        () =>
          new Promise((resolve, reject) =>
            _memcached().flush((error) =>
              // eslint-disable-next-line eqeqeq
              undefined != error ? reject(error) : resolve(),
            ),
          ),
        $error.fromUnknown(Error('Cannot clear cache')),
      ),
    ),
  }
}
