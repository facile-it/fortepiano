import * as E from 'fp-ts/Either'
import got from 'got'
import { mocked } from 'ts-jest/utils'
import { $got } from './Got'

jest.mock('got')

describe('Http', () => {
  describe('got', () => {
    describe('get', () => {
      it('should wrap a response', async () => {
        mocked(got, true).mockResolvedValue({
          url: 'bar',
          statusCode: 200,
          headers: {
            foo: 'bar',
            thx: undefined,
            mad: ['max'],
          },
          body: 42,
        })

        await expect(
          $got(mocked(got, true)).get('foo')(),
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
        mocked(got, true).mockRejectedValue(error)

        await expect(
          $got(mocked(got, true)).get('foo')(),
        ).resolves.toStrictEqual(E.left(error))
      })
    })
  })
})
