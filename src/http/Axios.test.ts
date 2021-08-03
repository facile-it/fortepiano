import axios from 'axios'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { mocked } from 'ts-jest/utils'
import { $axios } from './Axios'

jest.mock('axios')

describe('Http', () => {
  describe('axios', () => {
    describe('get', () => {
      it('should wrap a response', async () => {
        mocked(axios, true).request.mockResolvedValue({
          config: { url: 'bar' },
          status: 200,
          headers: {
            foo: 'bar',
            thx: 1138,
            mad: ['max'],
          },
          data: 42,
        })

        await expect(
          $axios(mocked(axios, true)).get('foo')(),
        ).resolves.toStrictEqual(
          E.right({
            url: 'bar',
            status: 200,
            headers: {
              foo: 'bar',
              mad: ['max'],
            },
            body: 42,
          }),
        )
      })
      it('should wrap an error', async () => {
        const error = Error('foo')
        mocked(axios, true).request.mockRejectedValue(error)

        await expect(
          $axios(mocked(axios, true)).get('foo')(),
        ).resolves.toStrictEqual(E.left(error))
      })
      it('should wrap an HTTP error', async () => {
        mocked(axios, true).request.mockRejectedValue({
          name: 'foo',
          message: 'bar',
          response: {
            config: {},
            status: 500,
            headers: {
              foo: 'bar',
              thx: 1138,
              mad: ['max'],
            },
            data: 42,
          },
        })
        mocked(axios, true).isAxiosError.mockReturnValue(true)

        await expect(
          pipe(
            $axios(mocked(axios, true)).get('foo'),
            TE.mapLeft((error: any) => error.response),
          )(),
        ).resolves.toStrictEqual(
          E.left({
            url: 'foo',
            status: 500,
            headers: {
              foo: 'bar',
              mad: ['max'],
            },
            body: 42,
          }),
        )
      })
    })
  })
})
