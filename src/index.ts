import * as $aggregate from './Aggregate'
import * as $binary from './Binary'
import * as $console from './Console'
import * as $crypto from './Crypto'
import * as $date from './Date'
import * as $eq from './Eq'
import * as $error from './Error'
import * as $has from './Has'
import * as $magma from './Magma'
import * as $matrix from './Matrix'
import * as $mock from './Mock'
import * as $option from './Option'
import * as $reader from './Reader'
import * as $readerEither from './ReaderEither'
import * as $readerTask from './ReaderTask'
import * as $readerTaskEither from './ReaderTaskEither'
import * as $readonlyArray from './ReadonlyArray'
import * as $readonlyRecord from './ReadonlyRecord'
import * as $readonlyTuple from './ReadonlyTuple'
import * as $string from './string'
import * as $struct from './struct'
import * as $taskEither from './TaskEither'
import * as $type from './Type'
import * as $validation from './Validation'
import * as $yield from './Yield'

export type ValueOf<A> = A[keyof A]

export type PartialDeep<A> = A extends { readonly [x: string]: unknown }
  ? Partial<{ readonly [K in keyof A]: PartialDeep<A[K]> }>
  : A

export type ValuesDeep<A> = A extends { readonly [x: string]: unknown } & {
  readonly [K in keyof A]: unknown
}
  ? A[keyof A] | ValuesDeep<A[keyof A]>
  : A

export type IntersectionDeep<A, B> = A extends { readonly [x: string]: unknown }
  ? A & {
      readonly [K in keyof B]: IntersectionDeep<
        K extends keyof A ? A[K] : unknown,
        B[K]
      >
    }
  : B

export {
  $aggregate,
  $binary,
  $console,
  $crypto,
  $date,
  $eq,
  $error,
  $has,
  $magma,
  $matrix,
  $mock,
  $option,
  $reader,
  $readerEither,
  $readerTask,
  $readerTaskEither,
  $readonlyArray,
  $readonlyRecord,
  $readonlyTuple,
  $string,
  $struct,
  $taskEither,
  $type,
  $validation,
  $yield,
}
