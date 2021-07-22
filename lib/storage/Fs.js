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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$fs = void 0;
const TE = __importStar(require("fp-ts/TaskEither"));
const path_1 = __importDefault(require("path"));
const $E = __importStar(require("../Error"));
const $Str = __importStar(require("../Stream"));
const $TE = __importStar(require("../TaskEither"));
const $fs = (fs, root) => ({
    getStream: (path) => $TE.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () { return fs.createReadStream(path_1.default.join(root, path)); }), $E.fromUnknown(Error(`Cannot get stream for file "${path}"`))),
    getUrl: (path) => TE.left(Error(`Cannot get URL for file "${path}"`)),
    read: (path) => $TE.tryCatch(() => fs.promises.readFile(path_1.default.join(root, path)), $E.fromUnknown(Error(`Cannot read file "${path}"`))),
    write: (path) => (data) => $TE.tryCatch(() => $Str.ReadableStreamC.is(data)
        ? new Promise((resolve, reject) => {
            data
                .pipe(fs.createWriteStream(path).on('error', reject))
                .on('end', resolve);
        })
        : fs.promises.writeFile(path_1.default.join(root, path), data), $E.fromUnknown(Error(`Cannot write file "${path}"`))),
    delete: (path) => $TE.tryCatch(() => fs.promises.rm(path_1.default.join(root, path)), $E.fromUnknown(Error(`Cannot delete file "${path}"`))),
});
exports.$fs = $fs;
