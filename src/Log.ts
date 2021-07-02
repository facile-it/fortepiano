import * as IO from 'fp-ts/IO'

export type Log = <A>(a: A) => IO.IO<void>

export interface HasLog {
  readonly log: {
    readonly log: Log
    readonly warn: Log
    readonly error: Log
    readonly info: Log
  }
}
