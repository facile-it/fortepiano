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
exports.picksTaskEitherK = exports.picksTaskK = exports.picksIOEitherK = exports.picksIOK = exports.picksEitherK = exports.picksOptionK = exports.picksW = exports.picks = exports.pick = void 0;
const function_1 = require("fp-ts/function");
const RTE = __importStar(require("fp-ts/ReaderTaskEither"));
const $S = __importStar(require("./struct"));
const pick = () => (k) => RTE.asks($S.lookup(k));
exports.pick = pick;
const picks = () => (k, f) => exports.picksW()(k, f);
exports.picks = picks;
const picksW = () => (k, f) => function_1.pipe(exports.pick()(k), RTE.chainW(f));
exports.picksW = picksW;
const picksOptionK = () => (onNone) => (k, f) => exports.picks()(k, RTE.fromOptionK(onNone)(f));
exports.picksOptionK = picksOptionK;
const picksEitherK = () => (k, f) => exports.picks()(k, RTE.fromEitherK(f));
exports.picksEitherK = picksEitherK;
const picksIOK = () => (k, f) => function_1.pipe(exports.pick()(k), RTE.chainIOK(f));
exports.picksIOK = picksIOK;
const picksIOEitherK = () => (k, f) => exports.picks()(k, RTE.fromIOEitherK(f));
exports.picksIOEitherK = picksIOEitherK;
const picksTaskK = () => (k, f) => function_1.pipe(exports.pick()(k), RTE.chainTaskK(f));
exports.picksTaskK = picksTaskK;
const picksTaskEitherK = () => (k, f) => exports.picks()(k, RTE.fromTaskEitherK(f));
exports.picksTaskEitherK = picksTaskEitherK;
