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
exports.$got = void 0;
const function_1 = require("fp-ts/function");
const RR = __importStar(require("fp-ts/ReadonlyRecord"));
const TE = __importStar(require("fp-ts/TaskEither"));
const got_1 = require("got");
const t = __importStar(require("io-ts"));
const $E = __importStar(require("../Error"));
const $S = __importStar(require("../string"));
const request = (_got, method, url, options = {}) => TE.tryCatch(() => _got(url, Object.assign({ headers: options.headers, method, retry: 0, searchParams: options.query }, (options.json
    ? { json: options.body, responseType: 'json' }
    : { form: options.body })))
    .then((response) => ({
    url: response.url,
    status: response.statusCode,
    headers: function_1.pipe(response.headers, RR.filter(t.union([t.string, t.readonlyArray(t.string)]).is)),
    body: options.json
        ? (response.body || {}).data
        : response.body,
}))
    .catch((error) => {
    if (!(error instanceof got_1.HTTPError)) {
        throw error;
    }
    throw {
        name: error.name,
        message: error.message,
        stack: error.stack,
        response: {
            url: error.response.url,
            status: error.response.statusCode,
            headers: function_1.pipe(error.response.headers, RR.filter(t.union([t.string, t.readonlyArray(t.string)]).is)),
            body: error.response.body,
        },
    };
}), $E.fromUnknown(Error(`Cannot make HTTP request "${$S.uppercase(method)} ${url}"`)));
const $got = (_got) => ({
    delete: (url, options) => request(_got, 'delete', url, options),
    get: (url, options) => request(_got, 'get', url, options),
    patch: (url, options) => request(_got, 'patch', url, options),
    post: (url, options) => request(_got, 'post', url, options),
    put: (url, options) => request(_got, 'put', url, options),
});
exports.$got = $got;
