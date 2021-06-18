"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.fromString = void 0;
var fp_ts_1 = require("fp-ts");
var function_1 = require("fp-ts/function");
var fromString = function (date) {
    return function_1.pipe(new Date(date), function (date) {
        return isFinite(date) ? fp_ts_1.option.some(date) : fp_ts_1.option.none;
    });
};
exports.fromString = fromString;
var parse = function (date) {
    return function_1.pipe(date, Date.parse, fp_ts_1.option.of, fp_ts_1.option.filter(isFinite));
};
exports.parse = parse;
