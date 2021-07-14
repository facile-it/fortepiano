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
exports.$redis = void 0;
const Ei = __importStar(require("fp-ts/Either"));
const function_1 = require("fp-ts/function");
const TE = __importStar(require("fp-ts/TaskEither"));
const io_ts_types_1 = require("io-ts-types");
const $Er = __importStar(require("../Error"));
const $TE = __importStar(require("../TaskEither"));
const $redis = (redis, ttl = Infinity) => ({
    get: (key, codec) => function_1.pipe($TE.tryCatch(() => new Promise((resolve, reject) => redis.get(key, (error, result) => {
        null !== error || null === result
            ? reject(error)
            : resolve(result);
    })), $Er.fromUnknown(Error(`Cannot find cache item "${key}"`))), TE.chainEitherK(function_1.flow(codec.decode, Ei.mapLeft($Er.fromUnknown(Error(`Cannot decode cache item "${key}" into "${codec.name}"`)))))),
    set: (key, codec, _ttl = ttl) => (value) => function_1.pipe($TE.tryCatch(() => new Promise((resolve, reject) => redis.set(key, io_ts_types_1.JsonFromString.pipe(codec).encode(value), 'EX', _ttl / 1000, (error) => (null !== error ? reject(error) : resolve()))), $Er.fromUnknown(Error(`Cannot write cache item "${key}"`)))),
    delete: (key) => function_1.pipe($TE.tryCatch(() => new Promise((resolve, reject) => redis.del(key, (error, result) => {
        null !== error || null === result ? reject(error) : resolve();
    })), $Er.fromUnknown(Error(`Cannot delete cache item "${key}"`)))),
    clear: function_1.pipe($TE.tryCatch(() => new Promise((resolve, reject) => redis.flushdb((error) => null !== error ? reject(error) : resolve())), $Er.fromUnknown(Error('Cannot clear cache')))),
});
exports.$redis = $redis;
