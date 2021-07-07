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
exports.storage = exports.memory = exports.log = exports.chain = void 0;
const function_1 = require("fp-ts/function");
const RNEA = __importStar(require("fp-ts/ReadonlyNonEmptyArray"));
const TE = __importStar(require("fp-ts/TaskEither"));
const t = __importStar(require("io-ts"));
const Memory_1 = require("./cache/Memory");
Object.defineProperty(exports, "memory", { enumerable: true, get: function () { return Memory_1.memory; } });
const Storage_1 = require("./cache/Storage");
Object.defineProperty(exports, "storage", { enumerable: true, get: function () { return Storage_1.storage; } });
const $L = __importStar(require("./Log"));
const chain = (...caches) => ({
    get: (key, codec = t.unknown) => function_1.pipe(caches, RNEA.reduce(TE.left(Error()), (value, { get }) => TE.Alt.alt(value, () => get(key, codec)))),
    set: (key, ttl) => (value) => function_1.pipe(caches, TE.traverseArray(({ set }) => set(key, ttl)(value)), TE.map(function_1.constVoid)),
    delete: (key) => function_1.pipe(caches, TE.traverseArray(({ delete: _delete }) => _delete(key)), TE.map(function_1.constVoid)),
    clear: function_1.pipe(caches, TE.traverseArray(({ clear }) => clear), TE.map(function_1.constVoid)),
});
exports.chain = chain;
const log = (end, start = $L.void) => (cache) => ({
    get: (key, codec = t.unknown) => function_1.pipe(start(`Item "${key}" retrieved from cache`), TE.fromIO, TE.chain(() => cache.get(key, codec)), TE.chainFirstIOK(() => end(`Item "${key}" retrieved from cache`))),
    set: (key, ttl) => (value) => function_1.pipe(start(`Item "${key}" saved to cache`), TE.fromIO, TE.chain(() => cache.set(key, ttl)(value)), TE.chainFirstIOK(() => end(`Item "${key}" saved to cache`))),
    delete: (key) => function_1.pipe(start(`Item "${key}" deleted from cache`), TE.fromIO, TE.chain(() => cache.delete(key)), TE.chainFirstIOK(() => end(`Item "${key}" deleted from cache`))),
    clear: function_1.pipe(start('Cache cleared'), TE.fromIO, TE.chain(() => cache.clear), TE.chainFirstIOK(() => end('Cache cleared'))),
});
exports.log = log;
