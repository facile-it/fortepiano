import { either } from 'fp-ts'
import * as E from 'fp-ts/Either'
import { identity } from 'io-ts'
import * as $C from './Cache'
import { cache, HttpError, HttpErrorC, HttpResponse, mock } from './Http'

jest.useFakeTimers()

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

  describe('HttpErrorC', () => {
    const response: HttpResponse = {
      url: 'https://example.com/',
      status: 500,
      headers: {
        'access-control-allow-origin': '*',
        charset: 'utf-8',
        'content-type': 'application/json',
      },
      body: '',
    }
    describe('without type given', () => {
      const codec = HttpErrorC()
      describe('given "Error" instance', () => {
        it('should not match type', async () => {
          const obj = new Error('Error messsage')
          expect(codec.is(obj)).toBeFalsy()
          expect(codec.validate(obj, [])._tag).toStrictEqual('Left')
        })
      })
      describe('given object with "HttpResponse" property', () => {
        it('should not match type', async () => {
          const obj = { response }
          expect(codec.is(obj)).toBeFalsy()
          expect(codec.validate(obj, [])._tag).toStrictEqual('Left')
        })
      })
      describe('given "HttpError" instance', () => {
        it('should match type successfully', async () => {
          const obj = new HttpError(response)
          expect(codec.is(obj)).toBeTruthy()
          expect(codec.validate(obj, [])._tag).toStrictEqual('Right')
          expect(
            either.match(identity, identity)(codec.validate(obj, [])),
          ).toStrictEqual(obj)
        })
      })
    })
    describe('given "BadRequest" type', () => {
      const codec = HttpErrorC('BadRequest')
      describe('given "HttpError" instance with "500" status code', () => {
        it('should match type successfully', async () => {
          const obj = new HttpError(response)
          expect(codec.is(obj)).toBeFalsy()
          expect(codec.validate(obj, [])._tag).toStrictEqual('Left')
        })
      })
      describe('given "HttpError" instance with "400" status code', () => {
        it('should match type successfully', async () => {
          const obj = new HttpError({ ...response, status: 400 })
          expect(codec.is(obj)).toBeTruthy()
          expect(codec.validate(obj, [])._tag).toStrictEqual('Right')
          expect(
            either.match(identity, identity)(codec.validate(obj, [])),
          ).toStrictEqual(obj)
        })
      })
    })
  })
})
