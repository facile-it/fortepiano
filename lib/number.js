"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ceil = exports.round = exports.floor = void 0;
const function_1 = require("fp-ts/function");
const approx = (method) => (digits = 0) => (a) => 0 === a
    ? a
    : function_1.pipe(a, String, (x) => `${x}e+${Math.max(0, digits)}`, Number, (x) => Math[method](x), String, (x) => `${x}e-${Math.max(0, digits)}`, Number);
exports.floor = approx('floor');
exports.round = approx('round');
exports.ceil = approx('ceil');
