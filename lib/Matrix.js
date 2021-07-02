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
exports.transpose = exports.MatrixC = void 0;
const Ei = __importStar(require("fp-ts/Either"));
const function_1 = require("fp-ts/function");
const RA = __importStar(require("fp-ts/ReadonlyArray"));
const RR = __importStar(require("fp-ts/ReadonlyRecord"));
const t = __importStar(require("io-ts"));
const io_ts_types_1 = require("io-ts-types");
const $Eq = __importStar(require("./Eq"));
const $RA = __importStar(require("./ReadonlyArray"));
const $RR = __importStar(require("./ReadonlyRecord"));
const is = (item) => (u) => function_1.pipe(u, t.readonlyArray(io_ts_types_1.readonlyNonEmptyArray(item)).decode, Ei.filterOrElseW($RA.same($Eq.getEqSize(RA)), function_1.constNull), Ei.match(function_1.constFalse, function_1.constTrue));
const MatrixC = (item) => t.brand(t.readonlyArray(io_ts_types_1.readonlyNonEmptyArray(item)), is(item), 'Matrix');
exports.MatrixC = MatrixC;
const transpose = (as) => function_1.pipe(as, RA.reduceWithIndex({}, (i, bs, row) => function_1.pipe(row, RA.reduceWithIndex(bs, (j, bs, a) => (Object.assign(Object.assign({}, bs), { [String(j)]: Object.assign(Object.assign({}, bs[String(j)]), { [String(i)]: a }) }))))), RR.map($RR.values), $RR.values);
exports.transpose = transpose;
