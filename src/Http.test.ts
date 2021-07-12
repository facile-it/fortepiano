import * as E from 'fp-ts/Either'
import * as $C from './Cache'
import { cache, mock } from './Http'

describe('Http', () => {
  describe('cache', () => {
    const _cache = $C.memory()
    const http = cache(_cache)(mock)

    describe('get', () => {
      it('should return the same successful result', async () => {
        const h = await http.get('foo')()
        const c = await http.get('foo')()

        if (E.isRight(h)) {
          expect(c).toStrictEqual(h)
        } else {
          expect(h).not.toStrictEqual(c)
        }
      })
      it('should return different results when the cache is cleared', async () => {
        const h = await http.get('foo')()
        await _cache.clear()
        const c = await http.get('foo')()

        expect(c).not.toStrictEqual(h)
      })
    })
  })
})
