import { either, taskEither } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import fetch from 'node-fetch'
import { mocked } from 'ts-jest/utils'
import { $fetch } from './Fetch'

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
          $fetch(mocked(fetch, true) as any).get('foo')(),
        ).resolves.toStrictEqual(
          either.right({
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
          $fetch(mocked(fetch, true) as any).get('foo')(),
        ).resolves.toStrictEqual(either.left(error))
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
            $fetch(mocked(fetch, true) as any).get('foo'),
            taskEither.mapLeft((error: any) => error.response),
          )(),
        ).resolves.toStrictEqual(
          either.left({
            url: 'bar',
            status: 500,
            headers: {
              foo: 'bar',
              mad: 'max',
            },
            body: 'foo',
          }),
        )
      })
    })
  })
})
