import * as $aggregate from './Aggregate'
import * as $binary from './Binary'
import * as $buffer from './Buffer'
import * as $cache from './Cache'
import * as $console from './Console'
import * as $crypto from './Crypto'
import * as $date from './Date'
import * as $eq from './Eq'
import * as $error from './Error'
import * as _$generatorL from './GeneratorL'
import * as $has from './Has'
import * as $http from './Http'
import * as $log from './Log'
import * as $magma from './Magma'
import * as $matrix from './Matrix'
import * as $mock from './Mock'
import * as $number from './number'
import * as $option from './Option'
import * as $random from './Random'
import * as $reader from './Reader'
import * as $readerEither from './ReaderEither'
import * as $readerTask from './ReaderTask'
import * as $readerTaskEither from './ReaderTaskEither'
import * as $readonlyArray from './ReadonlyArray'
import * as $readonlyRecord from './ReadonlyRecord'
import * as $readonlyTuple from './ReadonlyTuple'
import * as $storage from './Storage'
import * as $stream from './Stream'
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

/**
 * @deprecated Use `$yield` instead
 */
const $generatorL = _$generatorL

export {
  $aggregate,
  $binary,
  $buffer,
  $cache,
  $console,
  $crypto,
  $date,
  $eq,
  $error,
  $generatorL,
  $has,
  $http,
  $log,
  $magma,
  $matrix,
  $mock,
  $number,
  $option,
  $random,
  $reader,
  $readerEither,
  $readerTask,
  $readerTaskEither,
  $readonlyArray,
  $readonlyRecord,
  $readonlyTuple,
  $storage,
  $stream,
  $string,
  $struct,
  $taskEither,
  $type,
  $validation,
  $yield,
}
