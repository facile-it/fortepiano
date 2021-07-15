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
exports.hash = void 0;
const crypto_1 = __importDefault(require("crypto"));
const function_1 = require("fp-ts/function");
const TE = __importStar(require("fp-ts/TaskEither"));
const $E = __importStar(require("./Error"));
const HASH_SIZE = 16;
const hash = (encoding = 'hex', size = HASH_SIZE) => function_1.pipe(TE.tryCatch(() => new Promise((resolve, reject) => crypto_1.default.randomBytes(size, (error, buffer) => null !== error ? reject(error) : resolve(buffer))), $E.fromUnknown(Error('Cannot generate hash'))), TE.map((buffer) => buffer.toString(encoding)));
exports.hash = hash;
