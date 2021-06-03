import { Lazy } from 'fp-ts/function';
export declare const run: <A>(f: Lazy<A>) => A;
export declare function curry<A, B, C>(f: (a: A, b: B) => C): (a: A) => (b: B) => C;
export declare function curry<A, B, C, D>(f: (a: A, b: B, c: C) => D): (a: A) => (b: B) => (c: C) => D;
export declare function uncurry<A, B, C, D>(f: (a: A) => (b: B) => (c: C) => D): D extends (...args: any) => any ? never : (a: A, b: B, c: C) => D;
export declare function uncurry<A, B, C>(f: (a: A) => (b: B) => C): C extends (...args: any) => any ? never : (a: A, b: B) => C;
export declare const memoize: <A extends (...args: any) => any>(f: A) => A;
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
export declare const recurse: <A extends (...args: any) => any>(f: (self: A, depth: number) => A, cache?: boolean) => A;
/**
 * @example
 * type _Op<A> = { _tag: A; x: number; y: number }
 * type Add = _Op<'Add'>
 * type Mul = _Op<'Mul'>
 * type Sub = _Op<'Sub'>
 * type Div = _Op<'Div'>
 * type Op = Add | Mul | Sub | Div
 *
 * const calc = match<Op, Option<number>>({
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
export declare const match: <A extends {
    readonly _tag: string;
}, B>(onCases: { readonly [K in A["_tag"]]: (a: Extract<A, {
    readonly _tag: K;
}>) => B; }) => (a: A) => B;
