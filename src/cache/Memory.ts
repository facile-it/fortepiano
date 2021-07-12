import * as Ei from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as $C from '../Cache'

export const memory = (ttl = Infinity): $C.Cache => {
  let cache: Record<string, unknown> = {}
  let timeouts: Record<string, NodeJS.Timeout> = {}

  return {
    get: (key, codec) => async () =>
      pipe(
        key in cache
          ? Ei.right(cache[key])
          : Ei.left(Error(`Cannot find cache item "${key}"`)),
        Ei.filterOrElse(codec.is, () =>
          Error(`Cannot decode cache item "${key}" into "${codec.name}"`),
        ),
      ),
    set:
      (key, _, _ttl = ttl) =>
      (value) =>
      async () => {
        clearTimeout(timeouts[key])
        cache[key] = value
        timeouts[key] = setTimeout(() => {
          delete cache[key]
          delete timeouts[key]
        }, Math.min(Math.pow(2, 31) - 1, Math.max(0, _ttl)))

        return Ei.of(undefined)
      },
    delete: (key) => async () => {
      clearTimeout(timeouts[key])
      delete cache[key]
      delete timeouts[key]

      return Ei.of(undefined)
    },
    clear: async () => {
      Object.values(timeouts).forEach(clearTimeout)
      cache = {}
      timeouts = {}

      return Ei.of(undefined)
    },
  }
}
