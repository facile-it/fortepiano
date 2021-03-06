# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4](https://github.com/facile-it/fortepiano/compare/v0.1.3...v0.1.4) - 2022-06-24

### Security

- Fix CVE-2022-33987.

## [0.1.3](https://github.com/facile-it/fortepiano/compare/v0.1.2...v0.1.3) - 2022-05-31

### Added

- Add `AggregateError` inspired from TC39.
- Add `decode` method to `Type` module to help wrapping `io-ts` `Errors` into an `Error` subclass.
- Add unit tests for the `set` function of the `Redis` module.
- Add `Has` module and enhance `ReaderTaskEither` for smart dependencies management (inspired by [Effect-TS](https://www.matechs.com/open-source)):

  ```typescript
  // Foo.ts
  import { TaskEither } from 'fp-ts/TaskEither'
  import { $has, $readerTaskEither } from 'fortepiano'

  export interface Foo {
    bar(a: number): TaskEither<Error, string>
  }

  export const TagFoo = $has.tag<Foo>()

  export const $foo = {
    bar: $readerTaskEither.derivesTaskEither(TagFoo, 'bar'),
  }
  ```

  ```typescript
  // Bar.ts
  import { IOEither } from 'fp-ts/IOEither'
  import { $has, $readerTaskEither } from 'fortepiano'

  export interface Bar {
    (a: string): IOEither<Error, boolean>
  }

  export const TagBar = $has.tag<Bar>()

  export const bar = $readerTaskEither.deriveIOEither(TagBar)
  ```

  ```typescript
  // index.ts
  import { $has } from 'fortepiano'
  import { ioEither, readerTaskEither, taskEither } from 'fp-ts'
  import { pipe } from 'fp-ts/function'
  import { TagBar, bar } from './Bar'
  import { $foo, TagFoo } from './Foo'

  // const a: ReaderTaskEither<Has<Foo> & Has<Bar>, Error, boolean>
  const a = pipe($foo.bar(42), readerTaskEither.chainW(bar))

  // const b: TaskEither<Error, boolean>
  const b = a(
    // Let's mock our dependencies.
    pipe(
      $has.singleton(TagFoo, { bar: () => taskEither.of('foobar') }),
      $has.upsertAt(TagBar, () => ioEither.of(true)),
    ),
  )
  ```

### Changed

- Replace `struct` type with `Struct`.
- Rename `GeneratorL` module to `Yield`.
- Use `cause` property to record wrapped errors (inspired by TC39).

### Deprecated

- Deprecate `struct` (use `Struct` instead).
- Deprecate `GeneratorL` module (use `Yield` instead).

### Fixed

- Decode from Json and then from the given codec in the `get` function of the `Redis` module.

## [0.1.2](https://github.com/facile-it/fortepiano/compare/v0.1.1...v0.1.2) - 2022-04-29

### Added

- Add `LICENSE.md`.
- Add `CONTRIBUTING.md`.
- Add `CHANGELOG.md`.

### Changed

- Relicense as MIT.
- Update `README.md`.

### Deprecated

- Deprecate `$got` (use `$axios` instead).

## [0.1.1](https://github.com/facile-it/fortepiano/compare/v0.1.0...v0.1.1) - 2022-04-26

### Added

- Support [tree shaking](https://webpack.js.org/guides/tree-shaking/) via top-level imports:
  ```typescript
  import { curry } from 'fortepiano/function'
  // ...instead of `import { curry } from 'fortepiano/lib/function'`
  ```

### Deprecated

- Discourage imports from `fortepiano/lib/*` as they break tree shaking.

## [0.1.0](https://github.com/facile-it/fortepiano/releases/tag/v0.1.0) - 2022-04-20

### Added

- First public release of `fortepiano`.
