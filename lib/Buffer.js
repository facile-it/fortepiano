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
exports.BufferFromStringC = exports.BufferC = void 0;
const function_1 = require("fp-ts/function");
const t = __importStar(require("io-ts"));
const is = (u) => u instanceof Buffer;
exports.BufferC = new t.Type('Buffer', is, (u, c) => (is(u) ? t.success(u) : t.failure(u, c)), function_1.identity);
exports.BufferFromStringC = new t.Type('BufferFromString', is, (u, c) => {
    try {
        return t.string.is(u)
            ? t.success(Buffer.from(u, 'base64'))
            : t.failure(u, c);
    }
    catch (_) {
        return t.failure(u, c);
    }
}, (b) => b.toString('base64'));