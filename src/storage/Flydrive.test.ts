import { Storage, StorageManager } from '@slynova/flydrive'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { Readable } from 'stream'
import * as $B from '../Buffer'
import * as $S from '../Stream'
import { $flydrive } from './Flydrive'

class MemoryStorage extends Storage {
  private storage: Record<string, Buffer> = {}

  getStream(location: string) {
    if (!(location in this.storage)) {
      throw undefined
    }

    return Readable.from($B.BufferFromStringC.encode(this.storage[location]))
  }

  getUrl(location: string) {
    if (!(location in this.storage)) {
      throw undefined
    }

    return `data:;base64,${this.storage[location].toString('base64')}`
  }

  async getBuffer(location: string) {
    if (!(location in this.storage)) {
      throw undefined
    }

    return {
      content: this.storage[location],
      raw: undefined,
    }
  }

  async put(location: string, content: unknown) {
    if (!$B.BufferC.is(content) && !$S.ReadableStreamC.is(content)) {
      throw undefined
    }

    const buffer = $S.ReadableStreamC.is(content)
      ? await $B.fromStream(content)()
      : E.right(content)
    if (E.isLeft(buffer)) {
      throw undefined
    }

    this.storage[location] = buffer.right

    return { raw: undefined }
  }

  async delete(location: string) {
    if (!(location in this.storage)) {
      return { wasDeleted: false, raw: undefined }
    }

    delete this.storage[location]

    return { wasDeleted: true, raw: undefined }
  }
}

const flydrive = () => {
  const _flydrive = new StorageManager({
    disks: { test: { driver: 'memory', config: {} } },
    default: 'test',
  })
  _flydrive.registerDriver('memory', MemoryStorage)

  return _flydrive
}

describe('Storage', () => {
  describe('flydrive', () => {
    describe('read', () => {
      it('should fail with a missing file system', async () => {
        const _flydrive = $flydrive(flydrive)

        await expect(
          pipe(_flydrive.read('foo', { fileSystem: 'foo' }), T.map(E.isLeft))(),
        ).resolves.toBe(true)
      })
      it('should fail with a missing file', async () => {
        const _flydrive = $flydrive(flydrive)

        await expect(
          pipe(
            _flydrive.read('foo', { fileSystem: 'test' }),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
        await expect(
          pipe(_flydrive.read('foo'), T.map(E.isLeft))(),
        ).resolves.toBe(true)
      })
      it('should succeed with an existent file', async () => {
        const _flydrive = $flydrive(flydrive)

        await expect(
          pipe(
            Buffer.from('foo'),
            _flydrive.write('foo'),
            TE.chain(() => _flydrive.read('foo')),
          )(),
        ).resolves.toStrictEqual(E.right(Buffer.from('foo')))
      })
    })
    describe('delete', () => {
      it('should delete a file', async () => {
        const _flydrive = $flydrive(flydrive)

        await expect(
          pipe(
            Buffer.from('foo'),
            _flydrive.write('foo'),
            TE.chainFirst(() => _flydrive.delete('foo')),
            TE.chain(() => _flydrive.read('foo')),
            T.map(E.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })
  })
})
