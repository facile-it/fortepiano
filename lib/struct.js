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
exports.patch = exports.filterDeep = exports.toReadonlyArray = exports.Show = void 0;
var function_1 = require("fp-ts/function");
var RA = __importStar(require("fp-ts/ReadonlyArray"));
var RR = __importStar(require("fp-ts/ReadonlyRecord"));
var St = __importStar(require("fp-ts/struct"));
var function_2 = require("./function");
var $t = __importStar(require("./Type"));
exports.Show = { show: function (a) { return JSON.stringify(a); } };
var toReadonlyArray = function (a) { return RR.toReadonlyArray(a); };
exports.toReadonlyArray = toReadonlyArray;
var filterDeep = function (f) {
    return function (a) {
        return function_1.pipe(a, exports.toReadonlyArray, RA.filter(function (_a) {
            var _b = __read(_a, 2), _ = _b[0], value = _b[1];
            return f(value);
        }), RA.map(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            return $t.struct.is(value)
                ? [
                    key,
                    function_1.pipe(value, exports.filterDeep(f)),
                ]
                : [key, value];
        }), RA.reduce({}, function (b, _a) {
            var _b;
            var _c = __read(_a, 2), key = _c[0], value = _c[1];
            return (__assign(__assign({}, b), (_b = {}, _b[key] = value, _b)));
        }));
    };
};
exports.filterDeep = filterDeep;
var patch = function (b) {
    return function (a) {
        return function_1.pipe(b, exports.toReadonlyArray, RA.map(function (_a) {
            var _b = __read(_a, 2), key = _b[0], b = _b[1];
            return $t.struct.is(b)
                ? [key, exports.patch(b)(a[key])]
                : [key, b];
        }), RA.reduce({}, function (ab, _a) {
            var _b;
            var _c = __read(_a, 2), key = _c[0], b = _c[1];
            return (__assign(__assign({}, ab), (_b = {}, _b[key] = b, _b)));
        }), function_2.curry(St.getAssignSemigroup().concat)(a));
    };
};
exports.patch = patch;
