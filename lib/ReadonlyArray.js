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
exports.same = exports.anyElem = exports.allElems = exports.words = exports.cartesian = void 0;
const Ap = __importStar(require("fp-ts/Apply"));
const function_1 = require("fp-ts/function");
const RA = __importStar(require("fp-ts/ReadonlyArray"));
const $E = __importStar(require("./Eq"));
const function_2 = require("./function");
/**
 * {@link https://en.wikipedia.org/wiki/Cartesian_product}
 */
exports.cartesian = Ap.sequenceT(RA.Apply);
function words(size) {
    return (alphabet) => size < 1
        ? [[]]
        : function_1.pipe(alphabet, function_2.curry(RA.replicate)(size), ([head, ...tail]) => exports.cartesian(head, ...tail));
}
exports.words = words;
const allElems = (E) => (...elems) => (as) => function_1.pipe(elems, RA.intersection(E)(as), function_2.curry($E.getEqSize(RA).equals)(elems));
exports.allElems = allElems;
const anyElem = (E) => (...elems) => (as) => function_1.pipe(elems, RA.some((elem) => function_1.pipe(as, RA.elem(E)(elem))));
exports.anyElem = anyElem;
/**
 * @example
 * import { eq, string } from 'fp-ts'
 * import { Eq } from 'fp-ts/Eq'
 * import { pipe } from 'fp-ts/function'
 *
 * type User = { name: string; mother: string; father: string }
 *
 * const eqParents: Eq<User> = pipe(
 *   eq.tuple(string.Eq, string.Eq),
 *   eq.contramap(({ mother, father }) => [mother, father] as const)
 * )
 * const siblings = same(eqParents)
 *
 * expect(
 *   siblings([
 *     { name: 'Thomas', mother: 'Edith', father: 'Matthew' },
 *     { name: 'Thomas', mother: 'Edith', father: 'Richard' },
 *   ])
 * ).toBe(false)
 * expect(
 *   siblings([
 *     { name: 'Thomas', mother: 'Edith', father: 'Matthew' },
 *     { name: 'William', mother: 'Edith', father: 'Matthew' },
 *   ])
 * ).toBe(true)
 */
const same = (E) => (as) => function_1.pipe(as, RA.matchLeft(function_1.constTrue, (head, tail) => function_1.pipe(tail, RA.every(function_2.curry(E.equals)(head)))));
exports.same = same;
