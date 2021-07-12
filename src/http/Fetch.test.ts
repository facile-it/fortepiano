import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import fetch from 'node-fetch'
import { mocked } from 'ts-jest/utils'
import * as $S from '../struct'
import { fetch as _fetch } from './Fetch'

jest.mock('node-fetch')

describe('Http', () => {
  describe('fetch', () => {
    describe('get', () => {
      it('should wrap a response', async () => {
        mocked(fetch, true).mockResolvedValue({
          ok: true,
          url: 'bar',
          status: 200,
          headers: {
            entries: () => [
              ['foo', 'bar'],
              ['mad', 'max'],
            ],
          },
          text: () => Promise.resolve('foo'),
        } as any)

        await expect(
          _fetch(mocked(fetch, true) as any).get('foo')(),
        ).resolves.toStrictEqual(
          E.right({
            url: 'bar',
            status: 200,
            headers: {
              foo: 'bar',
              mad: 'max',
            },
            body: 'foo',
          }),
        )
      })
      it('should wrap an error', async () => {
        const error = Error('foo')
        mocked(fetch, true).mockRejectedValue(error)

        await expect(
          _fetch(mocked(fetch, true) as any).get('foo')(),
        ).resolves.toStrictEqual(E.left(error))
      })
      it('should wrap an HTTP error', async () => {
        mocked(fetch, true).mockResolvedValue({
          ok: false,
          url: 'bar',
          status: 500,
          statusText: 'foo',
          headers: {
            entries: () => [
              ['foo', 'bar'],
              ['mad', 'max'],
            ],
          },
          text: () => Promise.resolve('foo'),
        } as any)

        await expect(
          pipe(
            _fetch(mocked(fetch, true) as any).get('foo'),
            TE.mapLeft($S.updateAt('stack', undefined)),
          )(),
        ).resolves.toStrictEqual(
          E.left({
            name: 'Error',
            message: 'foo',
            stack: undefined,
            response: {
              url: 'bar',
              status: 500,
              headers: {
                foo: 'bar',
                mad: 'max',
              },
              body: 'foo',
            },
          }),
        )
      })
    })
  })
})
