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
exports.same = exports.anyElem = exports.allElems = exports.words = exports.cartesian = void 0;
var Ap = __importStar(require("fp-ts/Apply"));
var function_1 = require("fp-ts/function");
var RA = __importStar(require("fp-ts/ReadonlyArray"));
var $E = __importStar(require("./Eq"));
var function_2 = require("./function");
/**
 * {@link https://en.wikipedia.org/wiki/Cartesian_product}
 */
exports.cartesian = Ap.sequenceT(RA.Apply);
function words(size) {
    return function (alphabet) {
        return size < 1
            ? [[]]
            : function_1.pipe(alphabet, function_2.curry(RA.replicate)(size), function (_a) {
                var _b = __read(_a), head = _b[0], tail = _b.slice(1);
                return exports.cartesian.apply(void 0, __spreadArray([head], __read(tail)));
            });
    };
}
exports.words = words;
var allElems = function (E) {
    return function () {
        var elems = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            elems[_i] = arguments[_i];
        }
        return function (as) {
            return function_1.pipe(elems, RA.intersection(E)(as), function_2.curry($E.getEqSize(RA).equals)(elems));
        };
    };
};
exports.allElems = allElems;
var anyElem = function (E) {
    return function () {
        var elems = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            elems[_i] = arguments[_i];
        }
        return function (as) {
            return function_1.pipe(elems, RA.some(function (elem) { return function_1.pipe(as, RA.elem(E)(elem)); }));
        };
    };
};
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
var same = function (E) {
    return function (as) {
        return function_1.pipe(as, RA.matchLeft(function_1.constTrue, function (head, tail) {
            return function_1.pipe(tail, RA.every(function_2.curry(E.equals)(head)));
        }));
    };
};
exports.same = same;
