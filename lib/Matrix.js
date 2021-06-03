"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var Ei = __importStar(require("fp-ts/Either"));
var function_1 = require("fp-ts/function");
var RA = __importStar(require("fp-ts/ReadonlyArray"));
var RR = __importStar(require("fp-ts/ReadonlyRecord"));
var t = __importStar(require("io-ts"));
var io_ts_types_1 = require("io-ts-types");
var $Eq = __importStar(require("./Eq"));
var $RA = __importStar(require("./ReadonlyArray"));
var $RR = __importStar(require("./ReadonlyRecord"));
var is = function (item) {
    return function (u) {
        return function_1.pipe(u, t.readonlyArray(io_ts_types_1.readonlyNonEmptyArray(item)).decode, Ei.filterOrElseW($RA.same($Eq.getEqSize(RA)), function_1.constNull), Ei.match(function_1.constFalse, function_1.constTrue));
    };
};
var MatrixC = function (item) {
    return t.brand(t.readonlyArray(io_ts_types_1.readonlyNonEmptyArray(item)), is(item), 'Matrix');
};
exports.MatrixC = MatrixC;
var transpose = function (as) {
    return function_1.pipe(as, RA.reduceWithIndex({}, function (i, bs, row) {
        return function_1.pipe(row, RA.reduceWithIndex(bs, function (j, bs, a) {
            var _a, _b;
            return (__assign(__assign({}, bs), (_a = {}, _a[String(j)] = __assign(__assign({}, bs[String(j)]), (_b = {}, _b[String(i)] = a, _b)), _a)));
        }));
    }), RR.map($RR.values), $RR.values);
};
exports.transpose = transpose;
