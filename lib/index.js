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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$validation = exports.$type = exports.$struct = exports.$string = exports.$readonlyTuple = exports.$readonlyRecord = exports.$readonlyArray = exports.$readerTaskEither = exports.$readerTask = exports.$readerEither = exports.$reader = exports.$option = exports.$optics = exports.$number = exports.$mock = exports.$matrix = exports.$magma = exports.$log = exports.$http = exports.$generatorL = exports.$error = exports.$eq = exports.$date = exports.$cache = exports.$binary = exports.$aggregate = void 0;
const $aggregate = __importStar(require("./Aggregate"));
exports.$aggregate = $aggregate;
const $binary = __importStar(require("./Binary"));
exports.$binary = $binary;
const $cache = __importStar(require("./Cache"));
exports.$cache = $cache;
const $date = __importStar(require("./Date"));
exports.$date = $date;
const $eq = __importStar(require("./Eq"));
exports.$eq = $eq;
const $error = __importStar(require("./Error"));
exports.$error = $error;
const $generatorL = __importStar(require("./GeneratorL"));
exports.$generatorL = $generatorL;
const $http = __importStar(require("./Http"));
exports.$http = $http;
const $L = __importStar(require("./Log"));
const $magma = __importStar(require("./Magma"));
exports.$magma = $magma;
const $matrix = __importStar(require("./Matrix"));
exports.$matrix = $matrix;
const $mock = __importStar(require("./Mock"));
exports.$mock = $mock;
const $number = __importStar(require("./number"));
exports.$number = $number;
const $optics = __importStar(require("./Optics"));
exports.$optics = $optics;
const $option = __importStar(require("./Option"));
exports.$option = $option;
const $reader = __importStar(require("./Reader"));
exports.$reader = $reader;
const $readerEither = __importStar(require("./ReaderEither"));
exports.$readerEither = $readerEither;
const $readerTask = __importStar(require("./ReaderTask"));
exports.$readerTask = $readerTask;
const $readerTaskEither = __importStar(require("./ReaderTaskEither"));
exports.$readerTaskEither = $readerTaskEither;
const $readonlyArray = __importStar(require("./ReadonlyArray"));
exports.$readonlyArray = $readonlyArray;
const $readonlyRecord = __importStar(require("./ReadonlyRecord"));
exports.$readonlyRecord = $readonlyRecord;
const $readonlyTuple = __importStar(require("./ReadonlyTuple"));
exports.$readonlyTuple = $readonlyTuple;
const $string = __importStar(require("./string"));
exports.$string = $string;
const $struct = __importStar(require("./struct"));
exports.$struct = $struct;
const $type = __importStar(require("./Type"));
exports.$type = $type;
const $validation = __importStar(require("./Validation"));
exports.$validation = $validation;
const { _void } = $L, _log = __rest($L, ["_void"]);
const $log = Object.assign(Object.assign({}, _log), { void: _void });
exports.$log = $log;