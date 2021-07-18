import { Lazy } from 'fp-ts/function'

export const run = <A>(f: Lazy<A>): A => f()

export function curry<A, B, C>(f: (a: A, b: B) => C): (a: A) => (b: B) => C
export function curry<A, B, C, D>(
  f: (a: A, b: B, c: C) => D,
): (a: A) => (b: B) => (c: C) => D
export function curry(f: (...args: any) => any) {
  return function curried(...head: ReadonlyArray<unknown>) {
    return head.length >= f.length
      ? f(...head)
      : (...rest: ReadonlyArray<unknown>) => curried(...head.concat(rest))
  }
}

export function uncurry<A, B, C, D>(
  f: (a: A) => (b: B) => (c: C) => D,
): D extends (...args: any) => any ? never : (a: A, b: B, c: C) => D
export function uncurry<A, B, C>(
  f: (a: A) => (b: B) => C,
): C extends (...args: any) => any ? never : (a: A, b: B) => C
export function uncurry(f: (...args: any) => any) {
  return (...args: ReadonlyArray<unknown>) =>
    args.reduce((_f: any, arg) => _f(arg), f)
}

export const memoize = <A extends (...args: any) => any>(f: A): A => {
  const cache: Record<string, ReturnType<A>> = {}

  return ((...args: any): ReturnType<A> => {
    let key = ''
    try {
      key = JSON.stringify(args)
    } catch (error) {
      return f(...args)
    }

    if (!(key in cache)) {
      const result = f(...args)
      cache[key] =
        result instanceof Promise
          ? result.catch((error) => {
              delete cache[key]

              throw error
            })
          : result
    }

    return cache[key]
  }) as any
}

/**
 * @example
 * const pi = (max: number) => (): ((n?: number) => number) =>
 *   recurse((self, depth) => (n = 1) =>
 *     4 / n + (depth < max ? self(-1 * n + (n < 0 ? 2 : -2)) : 0)
 *   )
 * const pi100 = pi(100)()()
 *
 * expect(pi100).toBeGreaterThan(3.15)
 * expect(pi100).toBeLessThan(3.16)
 */
export const recurse = <A extends (...args: any) => any>(
  f: (self: A, depth: number) => A,
  cache = false,
): A => {
  let depth = 0
  let _cache: A | null = null
  const run = !cache
    ? f
    : (_self: A, _depth: number): A => {
        if (!_cache) {
          _cache = f(_self, _depth)
        }

        return _cache
      }

  const self = ((...args: any) => run(self, depth++)(...args)) as A

  return self
}

/**
 * @example
 * type _Op<A> = { _tag: A; x: number; y: number }
 * type Add = _Op<'Add'>
 * type Mul = _Op<'Mul'>
 * type Sub = _Op<'Sub'>
 * type Div = _Op<'Div'>
 * type Op = Add | Mul | Sub | Div
 *
 * const calc = match<Op>()({
 *   Add: ({ x, y }) => option.some(x + y),
 *   Mul: ({ x, y }) => option.some(x * y),
 *   Sub: ({ x, y }) => option.some(x - y),
 *   Div: ({ x, y }) => (0 === y ? option.none : option.some(x / y)),
 * })
 * const op = (_tag: Op['_tag']) => (y: number) => (x: number) => calc({ _tag, x, y })
 * const add = op('Add')
 * const mul = op('Mul')
 * const sub = op('Sub')
 * const div = op('Div')
 *
 * expect(
 *   pipe(
 *     option.of(42),
 *     option.chain(add(1138)),
 *     option.chain(mul(0.1)),
 *     option.chain(sub(1337)),
 *     option.chain(div(0.1)),
 *     option.getOrElse(() => NaN)
 *   )
 * ).toBeCloseTo(-12190)
 */
export const match =
  <A extends { readonly [k in K]: string }, K extends string = '_tag'>() =>
  <T extends A[K], B>(
    onCases: {
      readonly [t in T]: (a: Extract<A, { readonly [k in K]: t }>) => B
    },
    k: K = '_tag' as K,
  ) =>
  (a: A): B =>
    onCases[a[k] as T](a as Extract<A, { readonly [k in K]: T }>)
