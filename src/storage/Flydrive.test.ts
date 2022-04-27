import { Storage, StorageManager } from '@slynova/flydrive'
import { either, task, taskEither } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import { Readable } from 'stream'
import * as $buffer from '../Buffer'
import * as $stream from '../Stream'
import { $flydrive } from './Flydrive'

class MemoryStorage extends Storage {
  private storage: Record<string, Buffer> = {}

  getStream(location: string) {
    if (!(location in this.storage)) {
      throw undefined
    }

    return Readable.from(
      $buffer.BufferFromStringC.encode(this.storage[location]),
    )
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
    if (!$buffer.BufferC.is(content) && !$stream.ReadableStreamC.is(content)) {
      throw undefined
    }

    const buffer = $stream.ReadableStreamC.is(content)
      ? await $buffer.fromStream(content)()
      : either.right(content)
    if (either.isLeft(buffer)) {
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
          pipe(
            _flydrive.read('foo', { fileSystem: 'foo' }),
            task.map(either.isLeft),
          )(),
        ).resolves.toBe(true)
      })
      it('should fail with a missing file', async () => {
        const _flydrive = $flydrive(flydrive)

        await expect(
          pipe(
            _flydrive.read('foo', { fileSystem: 'test' }),
            task.map(either.isLeft),
          )(),
        ).resolves.toBe(true)
        await expect(
          pipe(_flydrive.read('foo'), task.map(either.isLeft))(),
        ).resolves.toBe(true)
      })
      it('should succeed with an existent file', async () => {
        const _flydrive = $flydrive(flydrive)

        await expect(
          pipe(
            Buffer.from('foo'),
            _flydrive.write('foo'),
            taskEither.apSecond(_flydrive.read('foo')),
          )(),
        ).resolves.toStrictEqual(either.right(Buffer.from('foo')))
      })
    })
    describe('delete', () => {
      it('should delete a file', async () => {
        const _flydrive = $flydrive(flydrive)

        await expect(
          pipe(
            Buffer.from('foo'),
            _flydrive.write('foo'),
            taskEither.apFirst(_flydrive.delete('foo')),
            taskEither.apSecond(_flydrive.read('foo')),
            task.map(either.isLeft),
          )(),
        ).resolves.toBe(true)
      })
    })
  })
})
