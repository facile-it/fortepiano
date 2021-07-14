import { Storage, StorageManager } from '@slynova/flydrive'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as $B from '../Buffer'
import { $flydrive } from './Flydrive'

class MemoryStorage extends Storage {
  private storage: Record<string, Buffer> = {}

  getBuffer(location: string) {
    return location in this.storage
      ? Promise.resolve({ content: this.storage[location], raw: undefined })
      : Promise.reject()
  }

  put(location: string, content: unknown) {
    if (!$B.BufferC.is(content)) {
      return Promise.reject()
    }

    this.storage[location] = content

    return Promise.resolve({ raw: undefined })
  }

  delete(location: string) {
    delete this.storage[location]

    return location in this.storage
      ? Promise.resolve({ wasDeleted: true, raw: undefined })
      : Promise.reject()
  }
}

const flydrive = new StorageManager({
  disks: { test: { driver: 'memory', config: {} } },
  default: 'test',
})
flydrive.registerDriver('memory', MemoryStorage)

describe('Storage', () => {
  describe('flydrive', () => {
    describe('read', () => {
      it('should fail with a missing file system', async () => {
        await expect(
          pipe(
            $flydrive(flydrive).read('foo', { fileSystem: 'foo' }),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
      it('should fail with a missing file', async () => {
        await expect(
          pipe(
            $flydrive(flydrive).read('foo', { fileSystem: 'test' }),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
        await expect(
          pipe($flydrive(flydrive).read('foo'), T.map(E.isLeft))(),
        ).resolves.toBe(true)
      })
      it('should succeed with an existent file', async () => {
        await expect(
          pipe(
            Buffer.from('foo'),
            $flydrive(flydrive).write('foo'),
            TE.apSecond($flydrive(flydrive).read('foo')),
          )(),
        ).resolves.toStrictEqual(E.right(Buffer.from('foo')))
      })
    })
    describe('delete', () => {
      it('should delete a file', async () => {
        await expect(
          pipe(
            Buffer.from('foo'),
            $flydrive(flydrive).write('foo'),
            TE.apFirst($flydrive(flydrive).delete('foo')),
            TE.apSecond($flydrive(flydrive).read('foo')),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })
  })
})
