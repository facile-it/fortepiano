# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Add `Struct` type.
- Rename `GeneratorL` module to `Yield`.

### Deprecated

- Deprecate `struct` (use `Struct` instead).
- Deprecate `GeneratorL` module (use `Yield` instead).

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
