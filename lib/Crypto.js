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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid4 = exports.hash = exports.randomBytes = void 0;
/* eslint-disable no-bitwise */
const crypto_1 = __importDefault(require("crypto"));
const function_1 = require("fp-ts/function");
const TE = __importStar(require("fp-ts/TaskEither"));
const $E = __importStar(require("./Error"));
const randomBytes = (size) => function_1.pipe(TE.tryCatch(() => new Promise((resolve, reject) => crypto_1.default.randomBytes(size, (error, buffer) => null !== error ? reject(error) : resolve(buffer))), $E.fromUnknown(Error(`Cannot generate ${size} random bytes`))));
exports.randomBytes = randomBytes;
const hash = (size, encoding = 'hex') => function_1.pipe(exports.randomBytes(size), TE.map((buffer) => buffer.toString(encoding)));
exports.hash = hash;
exports.uuid4 = function_1.pipe(exports.hash(16, 'hex'), TE.map((s) => `${s.slice(0, 8)}-${s.slice(8, 12)}-4${s.slice(13, 16)}-${(((s.charCodeAt(16) > 57
    ? s.charCodeAt(16) - 97
    : s.charCodeAt(16) - 48) &
    0x3) |
    0x8).toString(16)}${s.slice(17, 20)}-${s.slice(20)}`));
