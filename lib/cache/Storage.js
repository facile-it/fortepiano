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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const Ei = __importStar(require("fp-ts/Either"));
const function_1 = require("fp-ts/function");
const J = __importStar(require("fp-ts/Json"));
const t = __importStar(require("io-ts"));
const io_ts_types_1 = require("io-ts-types");
const $Er = __importStar(require("../Error"));
const function_2 = require("../function");
const $S = __importStar(require("../struct"));
const CacheItemC = t.type({
    exp: t.number,
    value: io_ts_types_1.Json,
});
const _storage = (storage, name, ttl = Infinity) => {
    const _storage = function_2.memoize(storage);
    return {
        get: (key, codec) => () => __awaiter(void 0, void 0, void 0, function* () {
            return function_1.pipe(_storage().getItem(`${undefined !== name ? `${name}_` : ''}${key}`), Ei.fromNullable(Error(`Cannot find cache item "${key}"`)), Ei.chain(function_1.flow(J.parse, Ei.chainW(CacheItemC.decode), Ei.mapLeft($Er.fromUnknown(Error(`Cannot decode cache item "${key}"`))))), Ei.filterOrElse(({ exp }) => Date.now() < exp, () => Error(`Cache item "${key}" is expired`)), Ei.map($S.lookup('value')), Ei.chain(function_1.flow(codec.decode, Ei.mapLeft($Er.fromUnknown(Error(`Cannot decode cache item "${key}" into "${codec.name}"`))))));
        }),
        set: (key, codec, _ttl = ttl) => (value) => () => __awaiter(void 0, void 0, void 0, function* () {
            return function_1.pipe({
                exp: Math.min(Number.MAX_SAFE_INTEGER, Date.now() + Math.max(0, _ttl) + 1),
                value: codec.encode(value),
            }, J.stringify, Ei.bimap($Er.fromUnknown(Error(`Cannot encode cache item "${key}"`)), (item) => _storage().setItem(`${undefined !== name ? `${name}_` : ''}${key}`, item)));
        }),
        delete: (key) => () => __awaiter(void 0, void 0, void 0, function* () {
            return function_1.pipe(_storage().removeItem(`${undefined !== name ? `${name}_` : ''}${key}`), Ei.of);
        }),
        clear: () => __awaiter(void 0, void 0, void 0, function* () { return function_1.pipe(_storage().clear(), Ei.of); }),
    };
};
exports.storage = _storage;
