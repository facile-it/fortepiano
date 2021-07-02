import * as Ei from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as J from 'fp-ts/Json'
import * as t from 'io-ts'
import * as $C from '../Cache'
import * as $Er from '../Error'

export const storage = (_storage: Storage): $C.Cache => ({
  get:
    (key: string, codec = t.unknown) =>
    async () =>
      pipe(
        _storage.getItem(key),
        Ei.fromNullable(Error(`Cannot find cache item "${key}"`)),
        Ei.chain(J.parse),
        Ei.mapLeft($Er.fromUnknown(Error(`Cannot decode cache item "${key}"`))),
        Ei.filterOrElse(codec.is, () =>
          Error(`Cannot decode cache item "${key}" into "${codec.name}"`),
        ),
      ),
  set: (key) => (value) => async () =>
    pipe(
      value,
      J.stringify,
      Ei.bimap(
        $Er.fromUnknown(Error(`Cannot encode cache item "${key}"`)),
        (x) => _storage.setItem(key, x),
      ),
    ),
  delete: (key) => async () => pipe(_storage.removeItem(key), Ei.of),
  clear: async () => pipe(_storage.clear(), Ei.of),
})
