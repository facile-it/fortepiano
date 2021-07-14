import * as Ei from 'fp-ts/Either'
import { flow, Lazy, pipe } from 'fp-ts/function'
import * as J from 'fp-ts/Json'
import * as t from 'io-ts'
import { Json } from 'io-ts-types'
import * as $C from '../Cache'
import * as $Er from '../Error'
import { memoize } from '../function'
import * as $S from '../struct'

const CacheItemC = t.type({
  exp: t.number,
  value: Json,
})

const _storage = (
  storage: Lazy<Storage>,
  name?: string,
  ttl = Infinity,
): $C.Cache => {
  const _storage = memoize(storage)

  return {
    get: (key, codec) => async () =>
      pipe(
        _storage().getItem(`${undefined !== name ? `${name}_` : ''}${key}`),
        Ei.fromNullable(Error(`Cannot find cache item "${key}"`)),
        Ei.chain(
          flow(
            J.parse,
            Ei.chainW(CacheItemC.decode),
            Ei.mapLeft(
              $Er.fromUnknown(Error(`Cannot decode cache item "${key}"`)),
            ),
          ),
        ),
        Ei.filterOrElse(
          ({ exp }) => Date.now() < exp,
          () => Error(`Cache item "${key}" is expired`),
        ),
        Ei.map($S.lookup('value')),
        Ei.chain(
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
      async () =>
        pipe(
          {
            exp: Math.min(
              Number.MAX_SAFE_INTEGER,
              Date.now() + Math.max(0, _ttl) + 1,
            ),
            value: codec.encode(value),
          },
          J.stringify,
          Ei.bimap(
            $Er.fromUnknown(Error(`Cannot encode cache item "${key}"`)),
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
        Ei.of,
      ),
    clear: async () => pipe(_storage().clear(), Ei.of),
  }
}

export { _storage as storage }
