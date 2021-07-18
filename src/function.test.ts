import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { curry, match, memoize, recurse, uncurry } from './function'

describe('function', () => {
  describe('curry', () => {
    it('should make a function partially appliable', () => {
      const f = (a: boolean, b: number) => [a, b] as const
      const g = (a: boolean, b: number, c: string) => [a, b, c] as const

      const a = true
      const b = 1138
      const c = 'foo'

      expect(curry(f)(a)(b)).toStrictEqual(f(a, b))
      expect(curry(g)(a)(b)(c)).toStrictEqual(g(a, b, c))
    })
  })

  describe('uncurry', () => {
    it('should convert a partially appliable function into an n-ary one', () => {
      const f = (a: boolean) => (b: number) => [a, b] as const
      const g = (a: boolean) => (b: number) => (c: string) => [a, b, c] as const

      const a = true
      const b = 1138
      const c = 'foo'

      expect(uncurry(f)(a, b)).toStrictEqual(f(a)(b))
      expect(uncurry(g)(a, b, c)).toStrictEqual(g(a)(b)(c))
    })
  })

  describe('memoize', () => {
    it('should return the memoized version of specified function', () => {
      const random = () => Math.random()
      const randomMemoized = memoize(random)

      expect(random()).not.toBe(random())
      expect(randomMemoized()).toBe(randomMemoized())
    })
  })

  describe('recurse', () => {
    it('should help prevent infinite recursion using depth knowledge', () => {
      const f = (): (() => string) =>
        recurse(
          (self, depth) => () =>
            depth < 16 ? (0 / 0).toString() + self() : ' Batman!',
        )
      const pi = (max: number) => (): ((n?: number) => number) =>
        recurse(
          (self, depth) =>
            (n = 1) =>
              4 / n + (depth < max ? self(-1 * n + (n < 0 ? 2 : -2)) : 0),
        )
      const pi100 = pi(100)()()

      expect(f()()).toBe(
        'NaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaNNaN Batman!',
      )
      expect(pi100).toBeGreaterThan(3.15)
      expect(pi100).toBeLessThan(3.16)
    })
  })

  describe('match', () => {
    it('should define case handlers for sum types', () => {
      interface A {
        _tag: 'A'
        a: boolean
      }
      interface B {
        _tag: 'B'
        b: number
      }
      interface C {
        _tag: 'C'
        c: string
      }
      type T = A | B | C

      const a: A = { _tag: 'A', a: true }
      const b: B = { _tag: 'B', b: 1138 }
      const c: C = { _tag: 'C', c: 'foo' }

      const f = match<T>()({
        A: ({ a }) => (a ? 'true' : 'false'),
        B: ({ b }) => (199 + b).toString(),
        C: ({ c }) => `${c}bar`,
      })

      expect(f(a)).toBe('true')
      expect(f(b)).toBe('1337')
      expect(f(c)).toBe('foobar')

      interface _Op<A> {
        _tag: A
        x: number
        y: number
      }
      type Add = _Op<'Add'>
      type Mul = _Op<'Mul'>
      type Sub = _Op<'Sub'>
      type Div = _Op<'Div'>
      type Op = Add | Mul | Sub | Div

      const calc = match<Op>()({
        Add: ({ x, y }) => O.some(x + y),
        Mul: ({ x, y }) => O.some(x * y),
        Sub: ({ x, y }) => O.some(x - y),
        Div: ({ x, y }) => (0 === y ? O.none : O.some(x / y)),
      })
      const op = (_tag: Op['_tag']) => (y: number) => (x: number) =>
        calc({ _tag, x, y })
      const add = op('Add')
      const mul = op('Mul')
      const sub = op('Sub')
      const div = op('Div')

      expect(
        pipe(
          O.of(42),
          O.chain(add(1138)),
          O.chain(mul(0.1)),
          O.chain(sub(1337)),
          O.chain(div(0.1)),
          O.getOrElse(() => NaN),
        ),
      ).toBeCloseTo(-12190)
    })
  })
})
