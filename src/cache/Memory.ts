import * as Ei from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import * as $C from '../Cache'

export const memory = (): $C.Cache => {
  let cache: Record<string, unknown> = {}

  return {
    get:
      (key: string, codec = t.unknown) =>
      async () =>
        pipe(
          key in cache
            ? Ei.right(cache[key])
            : Ei.left(Error(`Cannot find cache item "${key}"`)),
          Ei.filterOrElse(codec.is, () =>
            Error(`Cannot decode cache item "${key}" into "${codec.name}"`),
          ),
        ),
    set: (key) => (value) => async () => {
      cache[key] = value

      return Ei.of(undefined)
    },
    delete: (key) => async () => {
      delete cache[key]

      return Ei.of(undefined)
    },
    clear: async () => {
      cache = {}

      return Ei.of(undefined)
    },
  }
}
