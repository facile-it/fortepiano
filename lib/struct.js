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
exports.patch = exports.filterDeep = exports.updateAt = exports.modifyAt = exports.lookup = exports.toReadonlyArray = void 0;
const function_1 = require("fp-ts/function");
const RA = __importStar(require("fp-ts/ReadonlyArray"));
const RR = __importStar(require("fp-ts/ReadonlyRecord"));
const S = __importStar(require("fp-ts/struct"));
const function_2 = require("./function");
const $t = __importStar(require("./Type"));
const toReadonlyArray = (a) => RR.toReadonlyArray(a);
exports.toReadonlyArray = toReadonlyArray;
const lookup = (k) => (s) => s[k];
exports.lookup = lookup;
const modifyAt = (k, f) => (s) => (Object.assign(Object.assign({}, s), { [k]: f(s[k]) }));
exports.modifyAt = modifyAt;
const updateAt = (k, a) => exports.modifyAt(k, () => a);
exports.updateAt = updateAt;
const filterDeep = (f) => (a) => function_1.pipe(a, exports.toReadonlyArray, RA.filter(([_, value]) => f(value)), RA.map(([key, value]) => $t.struct.is(value)
    ? [
        key,
        function_1.pipe(value, exports.filterDeep(f)),
    ]
    : [key, value]), RA.reduce({}, (b, [key, value]) => (Object.assign(Object.assign({}, b), { [key]: value }))));
exports.filterDeep = filterDeep;
const patch = (b) => (a) => function_1.pipe(b, exports.toReadonlyArray, RA.map(([key, b]) => $t.struct.is(b)
    ? [key, exports.patch(b)(a[key])]
    : [key, b]), RA.reduce({}, (ab, [key, b]) => (Object.assign(Object.assign({}, ab), { [key]: b }))), function_2.curry(S.getAssignSemigroup().concat)(a));
exports.patch = patch;
