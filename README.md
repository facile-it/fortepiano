[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/facile-it/fortepiano/main)](https://github.com/facile-it/fortepiano/actions)
[![Codecov](https://img.shields.io/codecov/c/gh/facile-it/fortepiano)](https://app.codecov.io/gh/facile-it/fortepiano)
[![GitHub](https://img.shields.io/github/license/facile-it/fortepiano)](LICENSE.md)
[![npm](https://img.shields.io/npm/v/fortepiano)](https://www.npmjs.com/package/fortepiano)

# fortepiano

> Playing actual music over `fp-ts` notes

`fortepiano` provides a set of common abstractions for functional application development (e.g., `Http`, `Storage`...), while extending [`fp-ts`](https://github.com/gcanti/fp-ts) with useful modules _à la_ [`fp-ts-contrib`](https://github.com/gcanti/fp-ts-contrib).

## Getting Started

`fortepiano` stands on the shoulders of the giant `fp-ts`. As such, a good understanding of its [concepts](https://gcanti.github.io/fp-ts/) is suggested.

### Installation

The package is available via [npm](https://www.npmjs.com/package/fortepiano), and must be installed along with its peer dependencies:

```
npm install fortepiano fp-ts io-ts io-ts-types
```

Additional packages are required shall you want to use specific abstractions:

- [`memcached`](https://www.npmjs.com/package/memcached) and [`@types/memcached`](https://www.npmjs.com/package/@types/memcached) (`cache/Memcached`)
- [`redis`](https://www.npmjs.com/package/redis) and [`@types/redis`](https://www.npmjs.com/package/@types/redis) (`cache/Redis`)
- [`axios`](https://www.npmjs.com/package/axios) (`http/Axios`)
- [`got`](https://www.npmjs.com/package/got) (`http/Got`)
- [`@slynova/flydrive`](https://www.npmjs.com/package/@slynova/flydrive) (`storage/Flydrive`)

### Usage

Import modules (e.g., values) from package index and types from specific modules. "Function" module and abstraction implementations are an exception:

```typescript
import { $type } from 'fortepiano'
import { Struct } from 'fortepiano/struct'
import { curry } from 'fortepiano/function'
import { $axios } from 'fortepiano/http/Axios'
```

## Contributing

See the [CONTRIBUTING.md](CONTRIBUTING.md) file for details.

## Authors

- [Davide Caruso](https://github.com/davidecaruso)
- [Pier Roberto Lucisano](https://github.com/pierroberto)
- [Alberto Villa](https://github.com/xzhavilla)

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.
