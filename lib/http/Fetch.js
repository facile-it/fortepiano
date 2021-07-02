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
exports.$fetch = void 0;
const Ei = __importStar(require("fp-ts/Either"));
const function_1 = require("fp-ts/function");
const J = __importStar(require("fp-ts/Json"));
const O = __importStar(require("fp-ts/Option"));
const RA = __importStar(require("fp-ts/ReadonlyArray"));
const RR = __importStar(require("fp-ts/ReadonlyRecord"));
const Se = __importStar(require("fp-ts/Semigroup"));
const TE = __importStar(require("fp-ts/TaskEither"));
const t = __importStar(require("io-ts"));
const io_ts_types_1 = require("io-ts-types");
const $Er = __importStar(require("../Error"));
const $St = __importStar(require("../string"));
const request = (method, url, options = {}) => TE.tryCatch(() => fetch(function_1.pipe(options.query, O.fromNullable, O.map(RR.map((value) => value.toString())), O.map((query) => new URLSearchParams(query)), O.map((params) => params.toString()), O.filter(io_ts_types_1.NonEmptyString.is), O.match(() => url, (queryString) => `${url}?${queryString}`)), {
    // eslint-disable-next-line no-nested-ternary
    body: options.json
        ? function_1.pipe(options.body, J.stringify, Ei.getOrElseW(function_1.constUndefined))
        : t.record(t.string, t.unknown).is(options.body)
            ? function_1.pipe(options.body, O.fromNullable, O.map(RR.reduceWithIndex(new FormData(), (name, form, value) => {
                if (t.union([t.boolean, t.number, t.string]).is(value)) {
                    form.append(name, value.toString());
                }
                return form;
            })), O.getOrElseW(function_1.constUndefined))
            : undefined,
    headers: Object.assign(Object.assign({}, options.headers), (options.json ? { 'Content-Type': 'application/json' } : null)),
    method,
}).then((response) => (response.ok && options.json ? response.json() : response.text()).then((body) => {
    const _response = {
        url: response.url,
        statusCode: response.status,
        headers: function_1.pipe([...response.headers.entries()], RR.fromFoldable(Se.last(), RA.Foldable)),
        body,
    };
    if (!response.ok) {
        throw Object.assign(Object.assign({}, new Error(response.statusText)), { response: _response });
    }
    return _response;
})), (error) => 
// eslint-disable-next-line no-nested-ternary
$Er.ErrorC.is(error)
    ? error
    : t.string.is(error)
        ? Error(error)
        : Error(`Cannot make HTTP request "${$St.uppercase(method)} ${url}"`));
exports.$fetch = {
    delete: (url, options) => request('delete', url, options),
    get: (url, options) => request('get', url, options),
    patch: (url, options) => request('patch', url, options),
    post: (url, options) => request('post', url, options),
    put: (url, options) => request('put', url, options),
};
