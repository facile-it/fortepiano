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
exports.picksEitherK = exports.picksOptionK = exports.picksW = exports.picks = exports.pick = void 0;
var function_1 = require("fp-ts/function");
var RE = __importStar(require("fp-ts/ReaderEither"));
var $Optic = __importStar(require("./Optics"));
var pick = function () {
    return function (k) {
        return RE.asks($Optic.get(k));
    };
};
exports.pick = pick;
var picks = function () {
    return function (k, f) {
        return exports.picksW()(k, f);
    };
};
exports.picks = picks;
var picksW = function () {
    return function (k, f) {
        return function_1.pipe(exports.pick()(k), RE.chainW(f));
    };
};
exports.picksW = picksW;
var picksOptionK = function () {
    return function (onNone) {
        return function (k, f) {
            return exports.picks()(k, RE.fromOptionK(onNone)(f));
        };
    };
};
exports.picksOptionK = picksOptionK;
var picksEitherK = function () {
    return function (k, f) {
        return exports.picks()(k, RE.fromEitherK(f));
    };
};
exports.picksEitherK = picksEitherK;
