<p align="center">
<img src="./logo.png" width=150px" height="auto"/>
</p>

# fortepiano [ˌfɔrteˈpjaːno]

_Playing actual music over functional notes_ 🎶

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/facile-it/fortepiano/main)](https://github.com/facile-it/fortepiano/actions)
[![Codecov](https://img.shields.io/codecov/c/gh/facile-it/fortepiano)](https://app.codecov.io/gh/facile-it/fortepiano)
[![GitHub](https://img.shields.io/github/license/facile-it/fortepiano)](LICENSE.md)
[![npm](https://img.shields.io/npm/v/fortepiano)](https://www.npmjs.com/package/fortepiano)

## Description

Fortepiano is a mocking library for TypeScript. It promotes immutability, composability and purity, making it ideal for projects that embrace functional programming principles.

## Getting Started

### Installation

To install the stable version:

```bash
npm install fortepiano
```

or using yarn:

```bash
yarn add fortepiano
```

### Usage

Fortepiano uses a functional API to create and configure mocks, encouraging pure function usage and immutable mock objects.

Here's an example:

```typescript
import { $mock } from 'fortepiano'

interface User {
  firstName: string
  lastName: string
}

export const UserMock = (): $mock.Mock<User> =>
  $mock.struct({
    firstName: $mock.string,
    lastName: $mock.string,
  })

console.log(UserMock()()()) // Output: { firstName: 'randomString', lastName: 'randomString' }
```

## Contributing

See the [CONTRIBUTING.md](CONTRIBUTING.md) file for details.

## Authors

- [Davide Caruso](https://github.com/davidecaruso)
- [Pier Roberto Lucisano](https://github.com/pierroberto)
- [Alberto Villa](https://github.com/xzhayon)

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

<p align="center">
<img src="./logo.png" width="150px" height="auto"/>
</p>

# fortepiano [ˌfɔrteˈpjaːno]

_Playing actual music over `fp-ts` notes_ 🎶

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/facile-it/fortepiano/main)](https://github.com/facile-it/fortepiano/actions)
[![Codecov](https://img.shields.io/codecov/c/gh/facile-it/fortepiano)](https://app.codecov.io/gh/facile-it/fortepiano)
[![GitHub](https://img.shields.io/github/license/facile-it/fortepiano)](LICENSE.md)
[![npm](https://img.shields.io/npm/v/fortepiano)](https://www.npmjs.com/package/fortepiano)

## Description

Fortepiano is a mocking library for TypeScript. It promotes immutability, composability and purity, making it ideal for projects that embrace functional programming principles.

## Getting Started

### Installation

To install the stable version:

```bash
npm install fortepiano
```

or using Yarn:

```bash
yarn add fortepiano
```

### Usage

Fortepiano uses a functional API to create and configure mocks, encouraging pure function usage and immutable mock objects.

Import Fortepiano as a namespace:

```typescript
import * as $mock from 'fortepiano'
```

A mock is a function that produces an `IO`, so call it twice to generate a value:

```typescript
const value = $mock.string()()

console.log(value) // A randomly generated string
```

#### Creating structured mocks

Use `$mock.struct` to combine mocks:

```typescript
import * as $mock from 'fortepiano'

interface User {
  firstName: string
  lastName: string
}

export const UserMock = (): $mock.Mock<User> =>
  $mock.struct({
    firstName: $mock.string,
    lastName: $mock.string,
  })

const user = UserMock()()()

console.log(user)
// { firstName: "<random string>", lastName: "<random string>" }
```

`UserMock()` creates the mock, the second call creates its `IO`, and the third call executes that `IO`.

You can also define the mock directly:

```typescript
const userMock: $mock.Mock<User> = $mock.struct({
  firstName: $mock.string,
  lastName: $mock.string,
})

const user = userMock()()
```

#### Using fixed values

Use `$mock.of` when a mock should always produce a specific value:

```typescript
const testString = $mock.of('test')

console.log(testString()()) // "test"
```

Fixed and generated values can be combined in a structured mock:

```typescript
const userMock: $mock.Mock<User> = $mock.struct({
  firstName: $mock.of('test'),
  lastName: $mock.string,
})

console.log(userMock()())
// { firstName: "test", lastName: "<random string>" }
```

#### Overriding generated values

A value can be supplied when invoking a mock:

```typescript
console.log($mock.string('test')()) // "test"
```

Structured mocks accept partial overrides:

```typescript
const userMock: $mock.Mock<User> = $mock.struct({
  firstName: $mock.string,
  lastName: $mock.string,
})

console.log(userMock({ firstName: 'John' })())
// { firstName: "John", lastName: "<random string>" }
```

This lets you reuse a mock while customizing only the properties relevant to a test.

#### Importing individual exports

You can import individual functions and types instead of using a namespace:

```typescript
import { of, string, struct, type Mock } from 'fortepiano'

interface User {
  firstName: string
  lastName: string
}

const userMock: Mock<User> = struct({
  firstName: of('test'),
  lastName: string,
})

console.log(userMock()())
```

## Contributing

See the [CONTRIBUTING.md](CONTRIBUTING.md) file for details.

## Authors

- [Davide Caruso](https://github.com/davidecaruso)
- [Pier Roberto Lucisano](https://github.com/pierroberto)
- [Alberto Villa](https://github.com/xzhayon)

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.
