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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lax = exports.literalUnion = exports.alias = exports.nullable = exports.struct = exports.literal = void 0;
var E = __importStar(require("fp-ts/Either"));
var function_1 = require("fp-ts/function");
var O = __importStar(require("fp-ts/Option"));
var RA = __importStar(require("fp-ts/ReadonlyArray"));
var RR = __importStar(require("fp-ts/ReadonlyRecord"));
var t = __importStar(require("io-ts"));
var isLiteral = function (r) {
    return function (u) {
        return t.string.is(u) && r.test(u);
    };
};
function literal(a, name) {
    return a instanceof RegExp
        ? new t.Type(name || 'Literal', isLiteral(a), function (u, c) { return (isLiteral(a)(u) ? t.success(u) : t.failure(u, c)); }, function_1.identity)
        : t.literal(a, name);
}
exports.literal = literal;
var isStruct = function (u) {
    return 'object' === typeof u && null !== u && !Array.isArray(u);
};
exports.struct = new t.Type('struct', isStruct, function (u, c) { return (isStruct(u) ? t.success(u) : t.failure(u, c)); }, function_1.identity);
var nullable = function (codec, name) {
    return t.union([codec, t.undefined], name);
};
exports.nullable = nullable;
var alias = function (name, _a) {
    var is = _a.is, decode = _a.decode, encode = _a.encode;
    return new t.Type(name, is, decode, encode);
};
exports.alias = alias;
var isStringArray = function (as) { return t.string.is(as[0]); };
function literalUnion(as, name) {
    return isStringArray(as)
        ? t.keyof(as.reduce(function (result, string) {
            var _a;
            return (__assign(__assign({}, result), (_a = {}, _a[string] = null, _a)));
        }, {}), name)
        : t.union(as.map(function (number) { return t.literal(number); }), name);
}
exports.literalUnion = literalUnion;
var lax = function (props, name) {
    return function_1.pipe(t.partial(props, name), function (partial) {
        return new t.Type(partial.name, partial.is, function_1.flow(t.UnknownRecord.validate, E.map(RR.toReadonlyArray), E.map(RA.reduce({}, function (result, _a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            return function_1.pipe(partial.props, RR.lookup(key), O.match(function () {
                var _a;
                return (__assign(__assign({}, result), (_a = {}, _a[key] = value, _a)));
            }, function (codec) {
                return function_1.pipe(codec.decode(value), E.match(function () { return result; }, function (value) {
                    var _a;
                    return (__assign(__assign({}, result), (_a = {}, _a[key] = value, _a)));
                }));
            }));
        })), E.chain(t.success)), partial.encode);
    });
};
exports.lax = lax;
