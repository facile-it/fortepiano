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
exports.mock = void 0;
const function_1 = require("fp-ts/function");
const TE = __importStar(require("fp-ts/TaskEither"));
const t = __importStar(require("io-ts"));
const function_2 = require("../function");
const $H = __importStar(require("../Http"));
const $M = __importStar(require("../Mock"));
const response = (url, error = false) => $M.struct({
    url: $M.literal(url),
    status: error ? $M.integer(300, 599) : $M.integer(200, 299),
    headers: $M.readonlyRecord($M.string, $M.union($M.string, $M.readonlyArray($M.string))),
    body: $M.unknown(),
});
const error = (url) => $M.struct({
    name: $M.string,
    message: $M.string,
    stack: $M.string,
    response: $M.nullable(response(url, true)),
});
const request = (url) => function_1.pipe($M.union(error(url), response(url)), TE.fromIOK(function_2.run), TE.chain((mock) => $H.HttpResponseC(t.unknown).is(mock)
    ? TE.right(mock)
    : TE.left(mock)));
exports.mock = {
    delete: request,
    get: request,
    patch: request,
    post: request,
    put: request,
};
