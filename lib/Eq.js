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
exports.getEqSize = exports.eqType = void 0;
var E = __importStar(require("fp-ts/Eq"));
var function_1 = require("fp-ts/function");
var N = __importStar(require("fp-ts/number"));
var S = __importStar(require("fp-ts/string"));
exports.eqType = function_1.pipe(S.Eq, E.contramap(function (a) { return typeof a; }));
var getEqSize = function (A) {
    return function_1.pipe(N.Eq, E.contramap(A.size));
};
exports.getEqSize = getEqSize;
