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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$fs = void 0;
const path_1 = __importDefault(require("path"));
const $E = __importStar(require("../Error"));
const $TE = __importStar(require("../TaskEither"));
const $fs = (fs, root) => ({
    read: (path) => $TE.tryCatch(() => fs.promises.readFile(path_1.default.join(root, path)), $E.fromUnknown(Error(`Cannot read file "${path}"`))),
    write: (path) => (buffer) => $TE.tryCatch(() => fs.promises.writeFile(path_1.default.join(root, path), buffer), $E.fromUnknown(Error(`Cannot write file "${path}"`))),
    delete: (path) => $TE.tryCatch(() => fs.promises.rm(path_1.default.join(root, path)), $E.fromUnknown(Error(`Cannot delete file "${path}"`))),
});
exports.$fs = $fs;
