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
exports.patch = exports.filterDeep = exports.toReadonlyArray = exports.Show = void 0;
const function_1 = require("fp-ts/function");
const RA = __importStar(require("fp-ts/ReadonlyArray"));
const RR = __importStar(require("fp-ts/ReadonlyRecord"));
const St = __importStar(require("fp-ts/struct"));
const function_2 = require("./function");
const $t = __importStar(require("./Type"));
exports.Show = { show: (a) => JSON.stringify(a) };
const toReadonlyArray = (a) => RR.toReadonlyArray(a);
exports.toReadonlyArray = toReadonlyArray;
const filterDeep = (f) => (a) => function_1.pipe(a, exports.toReadonlyArray, RA.filter(([_, value]) => f(value)), RA.map(([key, value]) => $t.struct.is(value)
    ? [
        key,
        function_1.pipe(value, exports.filterDeep(f)),
    ]
    : [key, value]), RA.reduce({}, (b, [key, value]) => (Object.assign(Object.assign({}, b), { [key]: value }))));
exports.filterDeep = filterDeep;
const patch = (b) => (a) => function_1.pipe(b, exports.toReadonlyArray, RA.map(([key, b]) => $t.struct.is(b)
    ? [key, exports.patch(b)(a[key])]
    : [key, b]), RA.reduce({}, (ab, [key, b]) => (Object.assign(Object.assign({}, ab), { [key]: b }))), function_2.curry(St.getAssignSemigroup().concat)(a));
exports.patch = patch;
