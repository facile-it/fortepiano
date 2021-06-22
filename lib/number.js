"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ceil = exports.round = exports.floor = void 0;
var function_1 = require("fp-ts/function");
var approx = function (method) {
    return function (digits) {
        if (digits === void 0) { digits = 0; }
        return function (a) {
            return 0 === a
                ? a
                : function_1.pipe(a, String, function (x) { return x + "e+" + Math.max(0, digits); }, Number, function (x) { return Math[method](x); }, String, function (x) { return x + "e-" + Math.max(0, digits); }, Number);
        };
    };
};
exports.floor = approx('floor');
exports.round = approx('round');
exports.ceil = approx('ceil');
