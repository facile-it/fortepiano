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
exports.mock = exports.log = exports.memoize = exports.json = exports.HttpErrorC = exports.HttpResponseC = void 0;
const function_1 = require("fp-ts/function");
const RTE = __importStar(require("fp-ts/ReaderTaskEither"));
const t = __importStar(require("io-ts"));
const $E = __importStar(require("./Error"));
const function_2 = require("./function");
const Mock_1 = require("./http/Mock");
Object.defineProperty(exports, "mock", { enumerable: true, get: function () { return Mock_1.mock; } });
const $RTE = __importStar(require("./ReaderTaskEither"));
const $Stri = __importStar(require("./string"));
const ERRORS = {
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
};
const HttpResponseC = (codec) => t.type({
    url: t.string,
    statusCode: t.number,
    headers: t.readonly(t.record(t.string, t.union([t.string, t.readonlyArray(t.string)]))),
    body: codec,
}, `HttpResponse(${codec.name})`);
exports.HttpResponseC = HttpResponseC;
const HttpErrorC = (type) => t.intersection([
    $E.ErrorC,
    t.type({
        response: t.intersection([
            exports.HttpResponseC(t.unknown),
            t.type({ statusCode: t.literal(ERRORS[type]) }),
        ]),
    }),
], `Http${type}Error`);
exports.HttpErrorC = HttpErrorC;
const _json = (request) => (url, options) => request(url, Object.assign(Object.assign({}, options), { json: true }));
const json = (client) => ({
    delete: _json(client.get),
    get: _json(client.get),
    patch: _json(client.patch),
    post: _json(client.post),
    put: _json(client.post),
});
exports.json = json;
const memoize = (client) => (Object.assign(Object.assign({}, client), { get: function_2.memoize((url, options) => {
        const promise = client.get(url, options)();
        return () => promise;
    }) }));
exports.memoize = memoize;
const _log = (method, request) => (url, options) => function_1.pipe($RTE.picksIOK()('log', ({ log }) => log(`${$Stri.uppercase(method)} ${url}`)), RTE.chainTaskEitherK(() => request(url, options)));
const log = (client) => ({
    delete: _log('delete', client.get),
    get: _log('get', client.get),
    patch: _log('patch', client.get),
    post: _log('post', client.get),
    put: _log('put', client.get),
});
exports.log = log;
