import _axios from 'axios'
import * as E from 'fp-ts/Either'
import { mocked } from 'ts-jest/utils'
import { axios } from './Axios'

jest.mock('axios')

describe('Http', () => {
  describe('axios', () => {
    describe('get', () => {
      it('should wrap a response', async () => {
        mocked(_axios, true).request.mockResolvedValue({
          config: { url: 'bar' },
          data: 42,
          headers: {
            foo: 'bar',
            thx: 1138,
            mad: ['max'],
          },
          status: 200,
        })

        await expect(
          axios(mocked(_axios, true)).get('foo')(),
        ).resolves.toStrictEqual(
          E.right({
            body: 42,
            headers: {
              foo: 'bar',
              mad: ['max'],
            },
            statusCode: 200,
            url: 'bar',
          }),
        )
      })
      it('should wrap an error', async () => {
        const error = Error('foo')
        mocked(_axios, true).request.mockRejectedValue(error)

        await expect(
          axios(mocked(_axios, true)).get('foo')(),
        ).resolves.toStrictEqual(E.left(error))
      })
      it('should wrap an HTTP error', async () => {
        mocked(_axios, true).request.mockRejectedValue({
          name: 'foo',
          message: 'bar',
          response: {
            config: {},
            data: 42,
            headers: {
              foo: 'bar',
              thx: 1138,
              mad: ['max'],
            },
            status: 500,
          },
        })
        mocked(_axios, true).isAxiosError.mockReturnValue(true)

        await expect(
          axios(mocked(_axios, true)).get('foo')(),
        ).resolves.toStrictEqual(
          E.left({
            name: 'foo',
            message: 'bar',
            stack: undefined,
            response: {
              body: 42,
              headers: {
                foo: 'bar',
                mad: ['max'],
              },
              statusCode: 500,
              url: 'foo',
            },
          }),
        )
      })
    })
  })
})
