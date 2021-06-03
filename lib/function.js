"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.match = exports.recurse = exports.memoize = exports.uncurry = exports.curry = exports.run = void 0;
var run = function (f) { return f(); };
exports.run = run;
function curry(f) {
    return function curried() {
        var head = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            head[_i] = arguments[_i];
        }
        return head.length >= f.length
            ? f.apply(void 0, __spreadArray([], __read(head))) : function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments[_i];
            }
            return curried.apply(void 0, __spreadArray([], __read(head.concat(rest))));
        };
    };
}
exports.curry = curry;
function uncurry(f) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args.reduce(function (_f, arg) { return _f(arg); }, f);
    };
}
exports.uncurry = uncurry;
var memoize = function (f) {
    var cache = {};
    return (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        try {
            var hash_1 = JSON.stringify(args);
            if (!(hash_1 in cache)) {
                var result = f.apply(void 0, __spreadArray([], __read(args)));
                cache[hash_1] =
                    result instanceof Promise
                        ? result.catch(function (e) {
                            delete cache[hash_1];
                            throw e;
                        })
                        : result;
            }
            return cache[hash_1];
        }
        catch (e) {
            return f.apply(void 0, __spreadArray([], __read(args)));
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
var recurse = function (f, cache) {
    if (cache === void 0) { cache = false; }
    var depth = 0;
    var _cache = null;
    var run = !cache
        ? f
        : function (_self, _depth) {
            if (!_cache) {
                _cache = f(_self, _depth);
            }
            return _cache;
        };
    var self = (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return run(self, depth++).apply(void 0, __spreadArray([], __read(args)));
    });
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
var match = function (onCases) {
    return function (a) {
        return onCases[a._tag](a);
    };
};
exports.match = match;
