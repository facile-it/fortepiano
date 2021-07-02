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
exports.parse = exports.fromString = exports.fromDate = void 0;
const function_1 = require("fp-ts/function");
const O = __importStar(require("fp-ts/Option"));
const fromDate = (date) => isFinite(date) ? O.some(date) : O.none;
exports.fromDate = fromDate;
const fromString = (date) => function_1.pipe(new Date(date), exports.fromDate);
exports.fromString = fromString;
const parse = (date) => function_1.pipe(date, Date.parse, O.of, O.filter(isFinite));
exports.parse = parse;
