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
exports.picksTaskK = exports.picksIOK = exports.picksW = exports.picks = exports.pick = void 0;
const function_1 = require("fp-ts/function");
const RT = __importStar(require("fp-ts/ReaderTask"));
const $S = __importStar(require("./struct"));
const pick = () => (k) => RT.asks($S.lookup(k));
exports.pick = pick;
const picks = () => (k, f) => exports.picksW()(k, f);
exports.picks = picks;
const picksW = () => (k, f) => function_1.pipe(exports.pick()(k), RT.chainW(f));
exports.picksW = picksW;
const picksIOK = () => (k, f) => exports.picks()(k, RT.fromIOK(f));
exports.picksIOK = picksIOK;
const picksTaskK = () => (k, f) => exports.picks()(k, RT.fromTaskK(f));
exports.picksTaskK = picksTaskK;
