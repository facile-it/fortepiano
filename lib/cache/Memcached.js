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
exports.$memcached = void 0;
const Ei = __importStar(require("fp-ts/Either"));
const function_1 = require("fp-ts/function");
const TE = __importStar(require("fp-ts/TaskEither"));
const $Er = __importStar(require("../Error"));
const $memcached = (memcached, ttl = Infinity) => ({
    get: (key, codec) => function_1.pipe(TE.tryCatch(() => new Promise((resolve, reject) => memcached.get(key, (error, data) => {
        // eslint-disable-next-line eqeqeq
        undefined != error || undefined == data
            ? reject(error)
            : resolve(data);
    })), $Er.fromUnknown(Error(`Cannot find cache item "${key}"`))), TE.chainEitherK(function_1.flow(codec.decode, Ei.mapLeft($Er.fromUnknown(Error(`Cannot decode cache item "${key}" into "${codec.name}"`)))))),
    set: (key, codec, _ttl = ttl) => (value) => function_1.pipe(TE.tryCatch(() => new Promise((resolve, reject) => memcached.set(key, codec.encode(value), _ttl / 1000, (error) => 
    // eslint-disable-next-line eqeqeq
    undefined != error ? reject(error) : resolve())), $Er.fromUnknown(Error(`Cannot write cache item "${key}"`)))),
    delete: (key) => function_1.pipe(TE.tryCatch(() => new Promise((resolve, reject) => memcached.del(key, (error) => {
        // eslint-disable-next-line eqeqeq
        undefined != error ? reject(error) : resolve();
    })), $Er.fromUnknown(Error(`Cannot delete cache item "${key}"`)))),
    clear: function_1.pipe(TE.tryCatch(() => new Promise((resolve, reject) => memcached.flush((error) => 
    // eslint-disable-next-line eqeqeq
    undefined != error ? reject(error) : resolve())), $Er.fromUnknown(Error('Cannot clear cache')))),
});
exports.$memcached = $memcached;
