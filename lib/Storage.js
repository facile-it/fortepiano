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
exports.log = void 0;
const function_1 = require("fp-ts/function");
const R = __importStar(require("fp-ts/Random"));
const TE = __importStar(require("fp-ts/TaskEither"));
const $L = __importStar(require("./Log"));
const $R = __importStar(require("./Random"));
const $Stri = __importStar(require("./string"));
const _log = ([verb, preposition], path, { fileSystem }, log) => (ma) => $R.salt(TE.MonadIO)(R.randomInt(0, Number.MAX_SAFE_INTEGER), (salt) => {
    const message = `[${salt}] \r${$Stri.capitalize(verb)} file "${path}"${undefined !== fileSystem
        ? ` ${preposition} file system "${fileSystem}"`
        : ''}`;
    return function_1.pipe(log.start(message), TE.fromIO, TE.chain(() => ma), TE.chainFirstIOK(() => log.end(message)), TE.orElseW((error) => function_1.pipe(log.end(message), TE.fromIO, TE.chain(() => TE.left(error)))));
});
const log = (logStart, logEnd = $L.void) => (storage) => ({
    read: (path, options = {}) => function_1.pipe(storage.read(path, options), _log(['reading', 'from'], path, options, {
        start: logStart,
        end: logEnd,
    })),
    write: (path, options = {}) => function_1.flow(storage.write(path, options), _log(['writing', 'to'], path, options, {
        start: logStart,
        end: logEnd,
    })),
    delete: (path, options = {}) => function_1.pipe(storage.delete(path, options), _log(['deleting', 'from'], path, options, {
        start: logStart,
        end: logEnd,
    })),
});
exports.log = log;
