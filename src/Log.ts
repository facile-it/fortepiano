import * as IO from 'fp-ts/IO'
import * as RR from 'fp-ts/ReadonlyRecord'

export type Logger = <A>(a: A) => IO.IO<void>

export type HasLog<A extends string = 'log'> = RR.ReadonlyRecord<
  A,
  {
    readonly log: Logger
    readonly warn: Logger
    readonly error: Logger
    readonly info: Logger
  }
>
