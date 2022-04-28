# Contributing

Any relevant modification to this project should be duly noted in `CHANGELOG.md`. Changelog entries should come along code patches via pull requests.

## Style guide

`fortepiano` modules should mymic `fp-ts` as best as they can regarding scope, naming and structure (see [`fp-ts` code conventions](https://gcanti.github.io/fp-ts/guides/code-conventions.html)). A custom convention should be used instead for imports and exports.

```typescript
/**
 * Import whole modules (i.e., values) from package index, and types
 * from specific modules. "Function" modules are an exception.
 */
import { option } from 'fp-ts'
import { Option } from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { curry } from './function'

/**
 * Use namespace imports for local modules; don't import from index,
 * it creates circular dependencies. Local modules must be spelled in
 * camel case to stand out from types, and are prefixed with a `$` to
 * avoid collisions.
 */
import * as $type from './Type'
// ...instead of `import { $type } from '.'`

/**
 * Use namespace imports for io-ts and friends, to avoid collisions
 * and enforce consistency.
 */
import * as t from 'io-ts'
import * as tt from 'io-ts-types'
import * as nt from 'newtype-ts'

/**
 * Types must be spelled in Pascal case. Prefix them with a `$` if
 * they collide with an internal type (e.g., `$Record`).
 */
export interface FooBar {}

/**
 * Export functions directly, and don't forget to export the whole
 * module as a namespace from index.
 */
export const fooBar = () => undefined
```

### _A Fistful of `$`s_

We're in no way fans of prefixing stuff with `$`, but it's the best way we've found so far to avoid name collisions with internal TypeScript types, `fp-ts` exports, and generic variables.
