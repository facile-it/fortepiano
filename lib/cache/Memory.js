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
exports.memory = void 0;
const Ei = __importStar(require("fp-ts/Either"));
const function_1 = require("fp-ts/function");
const t = __importStar(require("io-ts"));
const memory = (ttl = Infinity) => {
    let cache = {};
    let timeouts = {};
    return {
        get: (key, codec = t.unknown) => () => __awaiter(void 0, void 0, void 0, function* () {
            return function_1.pipe(key in cache
                ? Ei.right(cache[key])
                : Ei.left(Error(`Cannot find cache item "${key}"`)), Ei.filterOrElse(codec.is, () => Error(`Cannot decode cache item "${key}" into "${codec.name}"`)));
        }),
        set: (key, _ttl = ttl) => (value) => () => __awaiter(void 0, void 0, void 0, function* () {
            clearTimeout(timeouts[key]);
            cache[key] = value;
            timeouts[key] = setTimeout(() => {
                delete cache[key];
                delete timeouts[key];
            }, Math.min(Math.pow(2, 31) - 1, Math.max(0, _ttl)));
            return Ei.of(undefined);
        }),
        delete: (key) => () => __awaiter(void 0, void 0, void 0, function* () {
            clearTimeout(timeouts[key]);
            delete cache[key];
            delete timeouts[key];
            return Ei.of(undefined);
        }),
        clear: () => __awaiter(void 0, void 0, void 0, function* () {
            Object.values(timeouts).forEach(clearTimeout);
            cache = {};
            timeouts = {};
            return Ei.of(undefined);
        }),
    };
};
exports.memory = memory;
