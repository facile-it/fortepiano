"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.match = exports.recurse = exports.memoize = exports.uncurry = exports.curry = exports.run = void 0;
const run = (f) => f();
exports.run = run;
function curry(f) {
    return function curried(...head) {
        return head.length >= f.length
            ? f(...head)
            : (...rest) => curried(...head.concat(rest));
    };
}
exports.curry = curry;
function uncurry(f) {
    return (...args) => args.reduce((_f, arg) => _f(arg), f);
}
exports.uncurry = uncurry;
const memoize = (f) => {
    const cache = {};
    return ((...args) => {
        try {
            const hash = JSON.stringify(args);
            if (!(hash in cache)) {
                const result = f(...args);
                cache[hash] =
                    result instanceof Promise
                        ? result.catch((e) => {
                            delete cache[hash];
                            throw e;
                        })
                        : result;
            }
            return cache[hash];
        }
        catch (e) {
            return f(...args);
        }
    });
};
exports.memoize = memoize;
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
const recurse = (f, cache = false) => {
    let depth = 0;
    let _cache = null;
    const run = !cache
        ? f
        : (_self, _depth) => {
            if (!_cache) {
                _cache = f(_self, _depth);
            }
            return _cache;
        };
    const self = ((...args) => run(self, depth++)(...args));
    return self;
};
exports.recurse = recurse;
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
const match = (onCases) => (a) => onCases[a._tag](a);
exports.match = match;
