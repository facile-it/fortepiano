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
exports.$flydrive = void 0;
const function_1 = require("fp-ts/function");
const TE = __importStar(require("fp-ts/TaskEither"));
const $E = __importStar(require("../Error"));
const function_2 = require("../function");
const $Str = __importStar(require("../struct"));
const $TE = __importStar(require("../TaskEither"));
const $flydrive = (flydrive) => {
    const _flydrive = function_2.memoize(flydrive);
    return {
        getStream: (path, { fileSystem } = {}) => $TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () { return _flydrive().disk(fileSystem).getStream(path); }), $E.fromUnknown(Error(`Cannot get stream for file "${path}"${undefined !== fileSystem ? ` on file system "${fileSystem}"` : ''}`))),
        getUrl: (path, { fileSystem } = {}) => function_1.pipe($TE.tryCatch(() => _flydrive()
            .disk(fileSystem)
            .exists(path)
            .then(({ exists }) => exists ? Promise.resolve() : Promise.reject()), $E.fromUnknown(Error(`Cannot find file "${path}"${undefined !== fileSystem
            ? ` on file system "${fileSystem}"`
            : ''}`))), TE.apSecond($TE.tryCatch(() => Promise.resolve(_flydrive().disk(fileSystem).getUrl(path)), $E.fromUnknown(Error(`Cannot get URL for file "${path}"${undefined !== fileSystem
            ? ` on file system "${fileSystem}"`
            : ''}`))))),
        read: (path, { fileSystem } = {}) => $TE.tryCatch(() => _flydrive()
            .disk(fileSystem)
            .getBuffer(path)
            .then($Str.lookup('content')), $E.fromUnknown(Error(`Cannot read file "${path}"${undefined !== fileSystem
            ? ` from file system "${fileSystem}"`
            : ''}`))),
        write: (path, { fileSystem } = {}) => (data) => $TE.tryCatch(() => _flydrive().disk(fileSystem).put(path, data).then(function_1.constVoid), $E.fromUnknown(Error(`Cannot write file "${path}"${undefined !== fileSystem
            ? ` to file system "${fileSystem}"`
            : ''}`))),
        delete: (path, { fileSystem } = {}) => $TE.tryCatch(() => _flydrive()
            .disk(fileSystem)
            .delete(path)
            .then(({ wasDeleted }) => false === wasDeleted ? Promise.reject() : Promise.resolve()), $E.fromUnknown(Error(`Cannot delete file "${path}"${undefined !== fileSystem
            ? ` from file system "${fileSystem}"`
            : ''}`))),
    };
};
exports.$flydrive = $flydrive;
