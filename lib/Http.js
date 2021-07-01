"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.memoize = exports.json = exports.HttpResponseC = void 0;
var t = __importStar(require("io-ts"));
var function_1 = require("./function");
var ERRORS = {
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
};
var HttpResponseC = function (codec) {
    return t.type({
        url: t.string,
        statusCode: t.number,
        headers: t.readonly(t.record(t.string, t.union([t.string, t.readonlyArray(t.string)]))),
        body: codec,
    }, 'HttpResponse');
};
exports.HttpResponseC = HttpResponseC;
// const codec=t.intersection(
//   [ErrorC, t.type({ response: HttpResponseC(t.unknown) })],
//   'HttpError',
// )
// export const HttpErrorC = <A extends keyof typeof ERRORS>(type?: A) =>
//   codec.pipe(
//     new t.Type(
//       `Http${type}Error`,
// (u):u is HttpError & {
//   readonly response: HttpResponse & { readonly statusCode: typeof ERRORS[A] }
// }=>codec.is(u)&& ERRORS[type]=== u.response.statusCode,
// (e,c)=>,
// identity
//     )
//   )
var _json = function (request) {
    return function (url, options) {
        return request(url, __assign(__assign({}, options), { json: true }));
    };
};
var json = function (client) { return ({
    delete: _json(client.get),
    get: _json(client.get),
    patch: _json(client.patch),
    post: _json(client.post),
    put: _json(client.post),
}); };
exports.json = json;
var memoize = function (client) { return (__assign(__assign({}, client), { get: function_1.memoize(function (url, options) {
        var promise = client.get(url, options)();
        return function () { return promise; };
    }) })); };
exports.memoize = memoize;
// const isHttpError = (u: unknown): u is HttpError => u instanceof Error
// const isResponseError =
//   <A extends keyof typeof ERRORS>(type: A) =>
//   (
//     error: unknown,
//   ): error is HttpError & {
//     readonly response: HttpResponse & { readonly statusCode: typeof ERRORS[A] }
//   } =>
//     pipe(
//       error,
//       O.fromPredicate(isHttpError),
//       O.filter(t.type({ response: t.unknown }).is),
//       O.map($Optic.get('response')),
//       O.filter(({ statusCode }) => ERRORS[type] === statusCode),
//       $Optio.toBoolean,
//     )
// export const isBadRequest = isResponseError('BadRequest')
// export const isUnauthorized = isResponseError('Unauthorized')
// export const isForbidden = isResponseError('Forbidden')
// export const isNotFound = isResponseError('NotFound')
