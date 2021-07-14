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
exports.$flydrive = void 0;
const function_1 = require("fp-ts/function");
const $E = __importStar(require("../Error"));
const $Str = __importStar(require("../struct"));
const $TE = __importStar(require("../TaskEither"));
const $flydrive = (flydrive) => ({
    read: (path, { fileSystem } = {}) => $TE.tryCatch(() => flydrive.disk(fileSystem).getBuffer(path).then($Str.lookup('content')), $E.fromUnknown(Error(`Cannot read file "${path}"${undefined !== fileSystem ? ` from file system "${fileSystem}"` : ''}`))),
    write: (path, { fileSystem } = {}) => (buffer) => $TE.tryCatch(() => flydrive.disk(fileSystem).put(path, buffer).then(function_1.constVoid), $E.fromUnknown(Error(`Cannot write file "${path}"${undefined !== fileSystem ? ` to file system "${fileSystem}"` : ''}`))),
    delete: (path, { fileSystem } = {}) => $TE.tryCatch(() => flydrive
        .disk(fileSystem)
        .delete(path)
        .then(({ wasDeleted }) => true !== wasDeleted ? Promise.reject() : Promise.resolve()), $E.fromUnknown(Error(`Cannot delete file "${path}"${undefined !== fileSystem ? ` from file system "${fileSystem}"` : ''}`))),
});
exports.$flydrive = $flydrive;
