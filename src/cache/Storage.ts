import { either, json } from 'fp-ts'
import { flow, Lazy, pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import * as tt from 'io-ts-types'
import { Cache } from '../Cache'
import * as $error from '../Error'
import { memoize } from '../function'
import * as $struct from '../struct'

const CacheItemC = t.type({
  exp: t.number,
  value: tt.Json,
})

const _storage = (
  storage: Lazy<Storage>,
  name?: string,
  ttl = Infinity,
): Cache => {
  const _storage = memoize(storage)

  return {
    get: (key, codec) => async () =>
      pipe(
        _storage().getItem(`${undefined !== name ? `${name}_` : ''}${key}`),
        either.fromNullable(Error(`Cannot find cache item "${key}"`)),
        either.chain(
          flow(
            json.parse,
            either.chainW(CacheItemC.decode),
            either.mapLeft(
              $error.fromUnknown(Error(`Cannot decode cache item "${key}"`)),
            ),
          ),
        ),
        either.filterOrElse(
          ({ exp }) => Date.now() < exp,
          () => Error(`Cache item "${key}" is expired`),
        ),
        either.map($struct.lookup('value')),
        either.chain(
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
      async () =>
        pipe(
          {
            exp: Math.min(
              Number.MAX_SAFE_INTEGER,
              Date.now() + Math.max(0, _ttl) + 1,
            ),
            value: codec.encode(value),
          },
          json.stringify,
          either.bimap(
            $error.fromUnknown(Error(`Cannot encode cache item "${key}"`)),
            (item) =>
              _storage().setItem(
                `${undefined !== name ? `${name}_` : ''}${key}`,
                item,
              ),
          ),
        ),
    delete: (key) => async () =>
      pipe(
        _storage().removeItem(`${undefined !== name ? `${name}_` : ''}${key}`),
        either.of,
      ),
    clear: async () => pipe(_storage().clear(), either.of),
  }
}

export { _storage as storage }
