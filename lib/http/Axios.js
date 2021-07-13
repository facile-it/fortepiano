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
exports.axios = void 0;
const E = __importStar(require("fp-ts/Either"));
const function_1 = require("fp-ts/function");
const RR = __importStar(require("fp-ts/ReadonlyRecord"));
const TE = __importStar(require("fp-ts/TaskEither"));
const t = __importStar(require("io-ts"));
const $E = __importStar(require("../Error"));
const $S = __importStar(require("../string"));
const response = (url) => (response) => ({
    url: response.config.url || url,
    status: response.status,
    headers: function_1.pipe(response.headers, t.readonly(t.record(t.string, t.unknown)).decode, E.map(RR.filter(t.union([t.string, t.readonlyArray(t.string)]).is)), E.getOrElse(() => ({}))),
    body: response.data,
});
const request = (_axios, method, url, options = {}) => TE.tryCatch(() => _axios
    .request(Object.assign(Object.assign({ data: options.body, headers: Object.assign(Object.assign({}, options.headers), (options.json ? { 'Content-Type': 'application/json' } : null)), method, params: options.query }, (options.json ? { responseType: 'json' } : null)), { url }))
    .then(response(url))
    .catch((error) => {
    if (!_axios.isAxiosError(error) || undefined === error.response) {
        throw error;
    }
    throw {
        name: error.name,
        message: error.message,
        stack: error.stack,
        response: response(url)(error.response),
    };
}), $E.fromUnknown(Error(`Cannot make HTTP request "${$S.uppercase(method)} ${url}"`)));
const axios = (_axios) => ({
    delete: (url, options) => request(_axios, 'delete', url, options),
    get: (url, options) => request(_axios, 'get', url, options),
    patch: (url, options) => request(_axios, 'patch', url, options),
    post: (url, options) => request(_axios, 'post', url, options),
    put: (url, options) => request(_axios, 'put', url, options),
});
exports.axios = axios;
