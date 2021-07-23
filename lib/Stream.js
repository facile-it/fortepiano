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
exports.ReadWriteStreamC = exports.WritableStreamC = exports.ReadableStreamC = void 0;
const function_1 = require("fp-ts/function");
const t = __importStar(require("io-ts"));
const stream_1 = require("stream");
const isReadable = (u) => u instanceof stream_1.Readable;
exports.ReadableStreamC = new t.Type('ReadableStream', isReadable, (u, c) => (isReadable(u) ? t.success(u) : t.failure(u, c)), function_1.identity);
const isWritable = (u) => u instanceof stream_1.Writable;
exports.WritableStreamC = new t.Type('WritableStream', isWritable, (u, c) => (isWritable(u) ? t.success(u) : t.failure(u, c)), function_1.identity);
const isReadWrite = (u) => u instanceof stream_1.Duplex;
exports.ReadWriteStreamC = new t.Type('ReadWriteStream', isReadWrite, (u, c) => (isReadWrite(u) ? t.success(u) : t.failure(u, c)), function_1.identity);