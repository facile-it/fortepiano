import * as Ei from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as J from 'fp-ts/Json'
import * as t from 'io-ts'
import * as $C from '../Cache'
import * as $Er from '../Error'
import * as $O from '../Optics'

const CacheItemC = t.type({
  exp: t.number,
  value: t.unknown,
})

export const storage = (
  _storage: Storage,
  name?: string,
  ttl = Infinity,
): $C.Cache => ({
  get:
    (key: string, codec = t.unknown) =>
    async () =>
      pipe(
        _storage.getItem(`${undefined !== name ? `${name}_` : ''}${key}`),
        Ei.fromNullable(Error(`Cannot find cache item "${key}"`)),
        Ei.chain(J.parse),
        Ei.chainW(CacheItemC.decode),
        Ei.mapLeft($Er.fromUnknown(Error(`Cannot decode cache item "${key}"`))),
        Ei.filterOrElse(
          ({ exp }) => Date.now() < exp,
          () => Error(`Cache item "${key}" is expired`),
        ),
        Ei.map($O.get('value')),
        Ei.filterOrElse(codec.is, () =>
          Error(`Cannot decode cache item "${key}" into "${codec.name}"`),
        ),
      ),
  set:
    (key, _ttl = ttl) =>
    (value) =>
    async () =>
      pipe(
        {
          exp: Math.min(
            Number.MAX_SAFE_INTEGER,
            Date.now() + Math.max(0, _ttl) + 1,
          ),
          value,
        },
        J.stringify,
        Ei.bimap(
          $Er.fromUnknown(Error(`Cannot encode cache item "${key}"`)),
          (item) =>
            _storage.setItem(
              `${undefined !== name ? `${name}_` : ''}${key}`,
              item,
            ),
        ),
      ),
  delete: (key) => async () =>
    pipe(
      _storage.removeItem(`${undefined !== name ? `${name}_` : ''}${key}`),
      Ei.of,
    ),
  clear: async () => pipe(_storage.clear(), Ei.of),
})
