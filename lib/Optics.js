"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optics = exports.set = exports.modify = exports.getOption = exports.get = void 0;
const function_1 = require("fp-ts/function");
const O = __importStar(require("fp-ts/Option"));
/**
 * @example
 * import { flow, Predicate } from 'fp-ts/function'
 *
 * type User = { name: string; age: number }
 *
 * const gte = (m: number) => (n: number): boolean => n >= m
 * const adult: Predicate<User> = flow(get('age'), gte(18))
 *
 * expect(adult({ name: 'Scott', age: 7 })).toBe(false)
 * expect(adult({ name: 'Jonathan', age: 33 })).toBe(true)
 */
const get = (p) => (s) => s[p];
exports.get = get;
/**
 * @example
 * type Home = { name: string }
 * type User = { name: string; home?: Home }
 *
 * const home = (user: User): string =>
 *   pipe(
 *     user,
 *     optics.getOption('home'),
 *     option.match(
 *       () => `${user.name} is homeless`,
 *       (home) => `${user.name} lives at ${home.name}`
 *     )
 *   )
 *
 * expect(home({ name: 'Matthew', home: { name: 'Downton' } })).toBe(
 *   'Matthew lives at Downton'
 * )
 * expect(home({ name: 'Mary' })).toBe('Mary is homeless')
 */
const getOption = (p) => function_1.flow(exports.get(p), O.fromNullable);
exports.getOption = getOption;
/**
 * @example
 * import { Endomorphism, increment } from 'fp-ts/function'
 *
 * type User = { name: string; age: number }
 *
 * const birthday: Endomorphism<User> = modify('age', increment)
 *
 * expect(
 *   birthday({ name: 'Jonathan', age: 33 })
 * ).toStrictEqual(
 *   { name: 'Jonathan', age: 34, }
 * )
 */
const modify = (p, f) => (s) => (Object.assign(Object.assign({}, s), { [p]: f(s[p]) }));
exports.modify = modify;
/**
 * @example
 * import { Endomorphism } from 'fp-ts/function'
 *
 * type User = { name: string; status: 'Employed' | 'Unemployed' }
 *
 * const fire: Endomorphism<User> = set('status', 'Unemployed')
 *
 * expect(
 *   fire({ name: 'Thomas', status: 'Employed' })
 * ).toStrictEqual(
 *   { name: 'Thomas', status: 'Unemployed' }
 * )
 */
const set = (p, a) => exports.modify(p, () => a);
exports.set = set;
exports.optics = { get: exports.get, getOption: exports.getOption, modify: exports.modify, set: exports.set };
