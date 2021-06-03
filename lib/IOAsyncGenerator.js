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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
exports.sieve = exports.fromReadonlyArray = exports.replicate = exports.range = exports.partitionMapWithIndex = exports.partitionWithIndex = exports.filterMapWithIndex = exports.filterWithIndex = exports.FilterableWithIndex = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = exports.Filterable = exports.separate = exports.compact = exports.Compactable = exports.MonadIO = exports.chainIOReadonlyArrayK = exports.fromIOReadonlyArrayK = exports.fromIOReadonlyArray = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.fromIO = exports.FromIO = exports.Monad = exports.bind = exports.chainFirst = exports.chain = exports.Chain = exports.ApplicativeSeq = exports.ApplicativePar = exports.apS = exports.apSecond = exports.apFirst = exports.ap = exports.ApplySeq = exports.ApplyPar = exports.Do = exports.of = exports.Pointed = exports.FunctorWithIndex = exports.bindTo = exports.flap = exports.map = exports.Functor = exports.fromIOGenerator = exports.getMonoid = exports.URI = void 0;
exports.elem = exports.find = exports.head = exports.lookup = exports.isNonEmpty = exports.isEmpty = exports.toTask = exports.match = exports.uniq = exports.zip = exports.drop = exports.take = exports.flatten = exports.fibonacci = exports.exp = exports.prime = void 0;
var _Apply = __importStar(require("fp-ts/Apply"));
var Ch = __importStar(require("fp-ts/Chain"));
var Ei = __importStar(require("fp-ts/Either"));
var FIO = __importStar(require("fp-ts/FromIO"));
var function_1 = require("fp-ts/function");
var Fu = __importStar(require("fp-ts/Functor"));
var O = __importStar(require("fp-ts/Option"));
var RA = __importStar(require("fp-ts/ReadonlyArray"));
var S = __importStar(require("fp-ts/Separated"));
var T = __importStar(require("fp-ts/Task"));
var function_2 = require("./function");
var $IOG = __importStar(require("./GeneratorL"));
exports.URI = 'IOAsyncGenerator';
var getMonoid = function () { return ({
    empty: exports.fromReadonlyArray([]),
    concat: function (x, y) {
        return function () {
            return __asyncGenerator(this, arguments, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(x())))];
                        case 1: return [4 /*yield*/, __await.apply(void 0, [_b.sent()])];
                        case 2:
                            _b.sent();
                            return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(y())))];
                        case 3: return [4 /*yield*/, __await.apply(void 0, [_b.sent()])];
                        case 4:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
    },
}); };
exports.getMonoid = getMonoid;
var fromIOGenerator = function (as) {
    return function () {
        return __asyncGenerator(this, arguments, function () {
            var _b, _c, a, e_1_1;
            var e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 6, 7, 8]);
                        _b = __values(as()), _c = _b.next();
                        _e.label = 1;
                    case 1:
                        if (!!_c.done) return [3 /*break*/, 5];
                        a = _c.value;
                        return [4 /*yield*/, __await(a)];
                    case 2: return [4 /*yield*/, _e.sent()];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4:
                        _c = _b.next();
                        return [3 /*break*/, 1];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_c && !_c.done && (_d = _b.return)) _d.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
};
exports.fromIOGenerator = fromIOGenerator;
exports.Functor = {
    URI: exports.URI,
    map: function (fa, f) {
        return function () {
            return __asyncGenerator(this, arguments, function () {
                var _b, _c, a, e_2_1;
                var e_2, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 7, 8, 13]);
                            _b = __asyncValues(fa());
                            _e.label = 1;
                        case 1: return [4 /*yield*/, __await(_b.next())];
                        case 2:
                            if (!(_c = _e.sent(), !_c.done)) return [3 /*break*/, 6];
                            a = _c.value;
                            return [4 /*yield*/, __await(f(a))];
                        case 3: return [4 /*yield*/, _e.sent()];
                        case 4:
                            _e.sent();
                            _e.label = 5;
                        case 5: return [3 /*break*/, 1];
                        case 6: return [3 /*break*/, 13];
                        case 7:
                            e_2_1 = _e.sent();
                            e_2 = { error: e_2_1 };
                            return [3 /*break*/, 13];
                        case 8:
                            _e.trys.push([8, , 11, 12]);
                            if (!(_c && !_c.done && (_d = _b.return))) return [3 /*break*/, 10];
                            return [4 /*yield*/, __await(_d.call(_b))];
                        case 9:
                            _e.sent();
                            _e.label = 10;
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            if (e_2) throw e_2.error;
                            return [7 /*endfinally*/];
                        case 12: return [7 /*endfinally*/];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
    },
};
exports.map = function_2.curry(function_1.flip(exports.Functor.map));
exports.flap = Fu.flap(exports.Functor);
exports.bindTo = Fu.bindTo(exports.Functor);
exports.FunctorWithIndex = __assign(__assign({}, exports.Functor), { mapWithIndex: function (fa, f) {
        return exports.Functor.map(function_1.pipe(fa, exports.zip(exports.range(0))), function (_b) {
            var _c = __read(_b, 2), a = _c[0], i = _c[1];
            return f(i, a);
        });
    } });
exports.Pointed = {
    URI: exports.URI,
    of: function (a) { return exports.fromIOGenerator($IOG.of(a)); },
};
exports.of = exports.Pointed.of;
exports.Do = exports.Pointed.of({});
exports.ApplyPar = __assign(__assign({}, exports.Functor), { ap: function (fab, fa) {
        return function () {
            return __asyncGenerator(this, arguments, function () {
                var _fab, _fa, abs, as, _b, ab, a, abs_1, abs_1_1, ab, as_1, as_1_1, a, e_3_1, e_4_1;
                var e_4, _c, e_3, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _fab = fab();
                            _fa = fa();
                            abs = [];
                            as = [];
                            _e.label = 1;
                        case 1:
                            if (!true) return [3 /*break*/, 3];
                            return [4 /*yield*/, __await(Promise.all([_fab.next(), _fa.next()]))];
                        case 2:
                            _b = __read.apply(void 0, [_e.sent(), 2]), ab = _b[0], a = _b[1];
                            if (ab.done && a.done) {
                                return [3 /*break*/, 3];
                            }
                            if (!ab.done) {
                                abs.push(ab.value);
                            }
                            if (!a.done) {
                                as.push(a.value);
                            }
                            return [3 /*break*/, 1];
                        case 3:
                            _e.trys.push([3, 15, 16, 17]);
                            abs_1 = __values(abs), abs_1_1 = abs_1.next();
                            _e.label = 4;
                        case 4:
                            if (!!abs_1_1.done) return [3 /*break*/, 14];
                            ab = abs_1_1.value;
                            _e.label = 5;
                        case 5:
                            _e.trys.push([5, 11, 12, 13]);
                            as_1 = (e_3 = void 0, __values(as)), as_1_1 = as_1.next();
                            _e.label = 6;
                        case 6:
                            if (!!as_1_1.done) return [3 /*break*/, 10];
                            a = as_1_1.value;
                            return [4 /*yield*/, __await(ab(a))];
                        case 7: return [4 /*yield*/, _e.sent()];
                        case 8:
                            _e.sent();
                            _e.label = 9;
                        case 9:
                            as_1_1 = as_1.next();
                            return [3 /*break*/, 6];
                        case 10: return [3 /*break*/, 13];
                        case 11:
                            e_3_1 = _e.sent();
                            e_3 = { error: e_3_1 };
                            return [3 /*break*/, 13];
                        case 12:
                            try {
                                if (as_1_1 && !as_1_1.done && (_d = as_1.return)) _d.call(as_1);
                            }
                            finally { if (e_3) throw e_3.error; }
                            return [7 /*endfinally*/];
                        case 13:
                            abs_1_1 = abs_1.next();
                            return [3 /*break*/, 4];
                        case 14: return [3 /*break*/, 17];
                        case 15:
                            e_4_1 = _e.sent();
                            e_4 = { error: e_4_1 };
                            return [3 /*break*/, 17];
                        case 16:
                            try {
                                if (abs_1_1 && !abs_1_1.done && (_c = abs_1.return)) _c.call(abs_1);
                            }
                            finally { if (e_4) throw e_4.error; }
                            return [7 /*endfinally*/];
                        case 17: return [2 /*return*/];
                    }
                });
            });
        };
    } });
/**
 *
 */
exports.ApplySeq = __assign(__assign({}, exports.Functor), { ap: function (fab, fa) {
        return function () {
            return __asyncGenerator(this, arguments, function () {
                var abs, _b, _c, ab, e_5_1, as, _d, _e, a, e_6_1, abs_2, abs_2_1, ab, as_2, as_2_1, a, e_7_1, e_8_1;
                var e_8, _f, e_7, _g;
                var e_5, _h, e_6, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            abs = [];
                            _k.label = 1;
                        case 1:
                            _k.trys.push([1, 6, 7, 12]);
                            _b = __asyncValues(fab());
                            _k.label = 2;
                        case 2: return [4 /*yield*/, __await(_b.next())];
                        case 3:
                            if (!(_c = _k.sent(), !_c.done)) return [3 /*break*/, 5];
                            ab = _c.value;
                            abs.push(ab);
                            _k.label = 4;
                        case 4: return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 12];
                        case 6:
                            e_5_1 = _k.sent();
                            e_5 = { error: e_5_1 };
                            return [3 /*break*/, 12];
                        case 7:
                            _k.trys.push([7, , 10, 11]);
                            if (!(_c && !_c.done && (_h = _b.return))) return [3 /*break*/, 9];
                            return [4 /*yield*/, __await(_h.call(_b))];
                        case 8:
                            _k.sent();
                            _k.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            if (e_5) throw e_5.error;
                            return [7 /*endfinally*/];
                        case 11: return [7 /*endfinally*/];
                        case 12:
                            as = [];
                            _k.label = 13;
                        case 13:
                            _k.trys.push([13, 18, 19, 24]);
                            _d = __asyncValues(fa());
                            _k.label = 14;
                        case 14: return [4 /*yield*/, __await(_d.next())];
                        case 15:
                            if (!(_e = _k.sent(), !_e.done)) return [3 /*break*/, 17];
                            a = _e.value;
                            as.push(a);
                            _k.label = 16;
                        case 16: return [3 /*break*/, 14];
                        case 17: return [3 /*break*/, 24];
                        case 18:
                            e_6_1 = _k.sent();
                            e_6 = { error: e_6_1 };
                            return [3 /*break*/, 24];
                        case 19:
                            _k.trys.push([19, , 22, 23]);
                            if (!(_e && !_e.done && (_j = _d.return))) return [3 /*break*/, 21];
                            return [4 /*yield*/, __await(_j.call(_d))];
                        case 20:
                            _k.sent();
                            _k.label = 21;
                        case 21: return [3 /*break*/, 23];
                        case 22:
                            if (e_6) throw e_6.error;
                            return [7 /*endfinally*/];
                        case 23: return [7 /*endfinally*/];
                        case 24:
                            _k.trys.push([24, 36, 37, 38]);
                            abs_2 = __values(abs), abs_2_1 = abs_2.next();
                            _k.label = 25;
                        case 25:
                            if (!!abs_2_1.done) return [3 /*break*/, 35];
                            ab = abs_2_1.value;
                            _k.label = 26;
                        case 26:
                            _k.trys.push([26, 32, 33, 34]);
                            as_2 = (e_7 = void 0, __values(as)), as_2_1 = as_2.next();
                            _k.label = 27;
                        case 27:
                            if (!!as_2_1.done) return [3 /*break*/, 31];
                            a = as_2_1.value;
                            return [4 /*yield*/, __await(ab(a))];
                        case 28: return [4 /*yield*/, _k.sent()];
                        case 29:
                            _k.sent();
                            _k.label = 30;
                        case 30:
                            as_2_1 = as_2.next();
                            return [3 /*break*/, 27];
                        case 31: return [3 /*break*/, 34];
                        case 32:
                            e_7_1 = _k.sent();
                            e_7 = { error: e_7_1 };
                            return [3 /*break*/, 34];
                        case 33:
                            try {
                                if (as_2_1 && !as_2_1.done && (_g = as_2.return)) _g.call(as_2);
                            }
                            finally { if (e_7) throw e_7.error; }
                            return [7 /*endfinally*/];
                        case 34:
                            abs_2_1 = abs_2.next();
                            return [3 /*break*/, 25];
                        case 35: return [3 /*break*/, 38];
                        case 36:
                            e_8_1 = _k.sent();
                            e_8 = { error: e_8_1 };
                            return [3 /*break*/, 38];
                        case 37:
                            try {
                                if (abs_2_1 && !abs_2_1.done && (_f = abs_2.return)) _f.call(abs_2);
                            }
                            finally { if (e_8) throw e_8.error; }
                            return [7 /*endfinally*/];
                        case 38: return [2 /*return*/];
                    }
                });
            });
        };
    } });
exports.ap = function_2.curry(function_1.flip(exports.ApplyPar.ap));
exports.apFirst = _Apply.apFirst(exports.ApplyPar);
exports.apSecond = _Apply.apSecond(exports.ApplyPar);
exports.apS = _Apply.apS(exports.ApplyPar);
exports.ApplicativePar = __assign(__assign({}, exports.Pointed), exports.ApplyPar);
exports.ApplicativeSeq = __assign(__assign({}, exports.Pointed), exports.ApplySeq);
exports.Chain = __assign(__assign({}, exports.ApplySeq), { chain: function (fa, f) {
        return exports.flatten(exports.Functor.map(fa, f));
    } });
exports.chain = function_2.curry(function_1.flip(exports.Chain.chain));
exports.chainFirst = Ch.chainFirst(exports.Chain);
exports.bind = Ch.bind(exports.Chain);
exports.Monad = __assign(__assign({}, exports.ApplicativeSeq), exports.Chain);
exports.FromIO = {
    URI: exports.URI,
    fromIO: function (fa) { return function () { return exports.Pointed.of(fa())(); }; },
};
exports.fromIO = exports.FromIO.fromIO;
exports.fromIOK = FIO.fromIOK(exports.FromIO);
exports.chainIOK = FIO.chainIOK(exports.FromIO, exports.Chain);
exports.chainFirstIOK = FIO.chainFirstIOK(exports.FromIO, exports.Chain);
var fromIOReadonlyArray = function (fa) { return function_1.pipe(fa, exports.fromIO, exports.chain(exports.fromReadonlyArray)); };
exports.fromIOReadonlyArray = fromIOReadonlyArray;
var fromIOReadonlyArrayK = function (f) { return function_1.flow(f, exports.fromIOReadonlyArray); };
exports.fromIOReadonlyArrayK = fromIOReadonlyArrayK;
var chainIOReadonlyArrayK = function (f) { return exports.chain(exports.fromIOReadonlyArrayK(f)); };
exports.chainIOReadonlyArrayK = chainIOReadonlyArrayK;
exports.MonadIO = __assign(__assign({}, exports.Monad), exports.FromIO);
function _filter(fa, predicate) {
    return function () {
        return __asyncGenerator(this, arguments, function () {
            var _b, _c, a, e_9_1;
            var e_9, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 7, 8, 13]);
                        _b = __asyncValues(fa());
                        _e.label = 1;
                    case 1: return [4 /*yield*/, __await(_b.next())];
                    case 2:
                        if (!(_c = _e.sent(), !_c.done)) return [3 /*break*/, 6];
                        a = _c.value;
                        if (!predicate(a)) {
                            return [3 /*break*/, 5];
                        }
                        return [4 /*yield*/, __await(a)];
                    case 3: return [4 /*yield*/, _e.sent()];
                    case 4:
                        _e.sent();
                        _e.label = 5;
                    case 5: return [3 /*break*/, 1];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_9_1 = _e.sent();
                        e_9 = { error: e_9_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _e.trys.push([8, , 11, 12]);
                        if (!(_c && !_c.done && (_d = _b.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, __await(_d.call(_b))];
                    case 9:
                        _e.sent();
                        _e.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_9) throw e_9.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
}
exports.Compactable = {
    URI: exports.URI,
    compact: function (fa) { return exports.Functor.map(exports.Filterable.filter(fa, O.isSome), function (a) { return a.value; }); },
    separate: function (fa) {
        return S.separated(exports.Functor.map(_filter(fa, Ei.isLeft), function (a) { return a.left; }), exports.Functor.map(_filter(fa, Ei.isRight), function (a) { return a.right; }));
    },
};
exports.compact = exports.Compactable.compact;
exports.separate = exports.Compactable.separate;
function _partition(fa, predicate) {
    return S.separated(_filter(fa, function_1.not(predicate)), _filter(fa, predicate));
}
exports.Filterable = __assign(__assign(__assign({}, exports.Functor), exports.Compactable), { filter: _filter, filterMap: function (fa, f) { return exports.Compactable.compact(exports.Functor.map(fa, f)); }, partition: _partition, partitionMap: function (fa, f) { return exports.Compactable.separate(exports.Functor.map(fa, f)); } });
function filter(predicate) {
    return function (fa) { return exports.Filterable.filter(fa, predicate); };
}
exports.filter = filter;
exports.filterMap = function_2.curry(function_1.flip(exports.Filterable.filterMap));
function partition(predicate) {
    return function (fa) { return exports.Filterable.partition(fa, predicate); };
}
exports.partition = partition;
exports.partitionMap = function_2.curry(function_1.flip(exports.Filterable.partitionMap));
function _filterWithIndex(fa, predicateWithIndex) {
    return exports.Compactable.compact(exports.FunctorWithIndex.mapWithIndex(fa, function (i, a) {
        return predicateWithIndex(i, a) ? O.some(a) : O.none;
    }));
}
function _partitionWithIndex(fa, predicateWithIndex) {
    return exports.Compactable.separate(exports.FunctorWithIndex.mapWithIndex(fa, function (i, a) {
        return predicateWithIndex(i, a) ? Ei.right(a) : Ei.left(a);
    }));
}
exports.FilterableWithIndex = __assign(__assign(__assign({}, exports.FunctorWithIndex), exports.Filterable), { filterWithIndex: _filterWithIndex, filterMapWithIndex: function (fa, f) {
        return exports.Compactable.compact(exports.FunctorWithIndex.mapWithIndex(fa, f));
    }, partitionWithIndex: _partitionWithIndex, partitionMapWithIndex: function (fa, f) {
        return exports.Compactable.separate(exports.FunctorWithIndex.mapWithIndex(fa, f));
    } });
function filterWithIndex(predicateWithIndex) {
    return function (fa) {
        return exports.FilterableWithIndex.filterWithIndex(fa, predicateWithIndex);
    };
}
exports.filterWithIndex = filterWithIndex;
exports.filterMapWithIndex = function_2.curry(function_1.flip(exports.FilterableWithIndex.filterMapWithIndex));
function partitionWithIndex(predicateWithIndex) {
    return function (fa) {
        return exports.FilterableWithIndex.partitionWithIndex(fa, predicateWithIndex);
    };
}
exports.partitionWithIndex = partitionWithIndex;
exports.partitionMapWithIndex = function_2.curry(function_1.flip(exports.FilterableWithIndex.partitionMapWithIndex));
exports.range = function_1.flow($IOG.range, exports.fromIOGenerator);
exports.replicate = function_1.flow($IOG.replicate, exports.fromIOGenerator);
var fromReadonlyArray = function (x) {
    return function_1.flow($IOG.fromReadonlyArray, exports.fromIOGenerator)(x);
};
exports.fromReadonlyArray = fromReadonlyArray;
var sieve = function (f) {
    return function (as) {
        return function () {
            return __asyncGenerator(this, arguments, function () {
                var init, _b, _c, a, e_10_1;
                var e_10, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            init = [];
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 8, 9, 14]);
                            _b = __asyncValues(as());
                            _e.label = 2;
                        case 2: return [4 /*yield*/, __await(_b.next())];
                        case 3:
                            if (!(_c = _e.sent(), !_c.done)) return [3 /*break*/, 7];
                            a = _c.value;
                            if (!f(init, a)) {
                                return [3 /*break*/, 6];
                            }
                            init.push(a);
                            return [4 /*yield*/, __await(a)];
                        case 4: return [4 /*yield*/, _e.sent()];
                        case 5:
                            _e.sent();
                            _e.label = 6;
                        case 6: return [3 /*break*/, 2];
                        case 7: return [3 /*break*/, 14];
                        case 8:
                            e_10_1 = _e.sent();
                            e_10 = { error: e_10_1 };
                            return [3 /*break*/, 14];
                        case 9:
                            _e.trys.push([9, , 12, 13]);
                            if (!(_c && !_c.done && (_d = _b.return))) return [3 /*break*/, 11];
                            return [4 /*yield*/, __await(_d.call(_b))];
                        case 10:
                            _e.sent();
                            _e.label = 11;
                        case 11: return [3 /*break*/, 13];
                        case 12:
                            if (e_10) throw e_10.error;
                            return [7 /*endfinally*/];
                        case 13: return [7 /*endfinally*/];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
    };
};
exports.sieve = sieve;
exports.prime = function_1.pipe(exports.range(2), exports.sieve(function (init, a) {
    return function_1.pipe(init, RA.every(function (_a) { return 0 !== a % _a; }));
}));
exports.exp = function_1.pipe(exports.range(0), exports.map(function (n) { return Math.exp(n); }));
var fibonacci = function () {
    return __asyncGenerator(this, arguments, function () {
        var as;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    as = [1, 0];
                    _b.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 5];
                    return [4 /*yield*/, __await(as[1])];
                case 2: return [4 /*yield*/, _b.sent()];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    as = [as[1], as[0] + as[1]];
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
};
exports.fibonacci = fibonacci;
var flatten = function (as) {
    return function () {
        return __asyncGenerator(this, arguments, function () {
            var _b, _c, a, e_11_1;
            var e_11, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 7, 8, 13]);
                        _b = __asyncValues(as());
                        _e.label = 1;
                    case 1: return [4 /*yield*/, __await(_b.next())];
                    case 2:
                        if (!(_c = _e.sent(), !_c.done)) return [3 /*break*/, 6];
                        a = _c.value;
                        return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(a())))];
                    case 3: return [4 /*yield*/, __await.apply(void 0, [_e.sent()])];
                    case 4:
                        _e.sent();
                        _e.label = 5;
                    case 5: return [3 /*break*/, 1];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_11_1 = _e.sent();
                        e_11 = { error: e_11_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _e.trys.push([8, , 11, 12]);
                        if (!(_c && !_c.done && (_d = _b.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, __await(_d.call(_b))];
                    case 9:
                        _e.sent();
                        _e.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_11) throw e_11.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
};
exports.flatten = flatten;
var take = function (n) {
    return function (as) {
        return function () {
            return __asyncGenerator(this, arguments, function () {
                var _b, _c, _d, a, i, e_12_1;
                var e_12, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _f.trys.push([0, 7, 8, 13]);
                            _b = __asyncValues(function_1.pipe(as, exports.zip(exports.range(0)))());
                            _f.label = 1;
                        case 1: return [4 /*yield*/, __await(_b.next())];
                        case 2:
                            if (!(_c = _f.sent(), !_c.done)) return [3 /*break*/, 6];
                            _d = __read(_c.value, 2), a = _d[0], i = _d[1];
                            if (i >= n) {
                                return [3 /*break*/, 6];
                            }
                            return [4 /*yield*/, __await(a)];
                        case 3: return [4 /*yield*/, _f.sent()];
                        case 4:
                            _f.sent();
                            _f.label = 5;
                        case 5: return [3 /*break*/, 1];
                        case 6: return [3 /*break*/, 13];
                        case 7:
                            e_12_1 = _f.sent();
                            e_12 = { error: e_12_1 };
                            return [3 /*break*/, 13];
                        case 8:
                            _f.trys.push([8, , 11, 12]);
                            if (!(_c && !_c.done && (_e = _b.return))) return [3 /*break*/, 10];
                            return [4 /*yield*/, __await(_e.call(_b))];
                        case 9:
                            _f.sent();
                            _f.label = 10;
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            if (e_12) throw e_12.error;
                            return [7 /*endfinally*/];
                        case 12: return [7 /*endfinally*/];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
    };
};
exports.take = take;
var drop = function (n) {
    return function (as) {
        return function () {
            return __asyncGenerator(this, arguments, function () {
                var _b, _c, _d, a, i, e_13_1;
                var e_13, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _f.trys.push([0, 7, 8, 13]);
                            _b = __asyncValues(function_1.pipe(as, exports.zip(exports.range(0)))());
                            _f.label = 1;
                        case 1: return [4 /*yield*/, __await(_b.next())];
                        case 2:
                            if (!(_c = _f.sent(), !_c.done)) return [3 /*break*/, 6];
                            _d = __read(_c.value, 2), a = _d[0], i = _d[1];
                            if (i < n) {
                                return [3 /*break*/, 5];
                            }
                            return [4 /*yield*/, __await(a)];
                        case 3: return [4 /*yield*/, _f.sent()];
                        case 4:
                            _f.sent();
                            _f.label = 5;
                        case 5: return [3 /*break*/, 1];
                        case 6: return [3 /*break*/, 13];
                        case 7:
                            e_13_1 = _f.sent();
                            e_13 = { error: e_13_1 };
                            return [3 /*break*/, 13];
                        case 8:
                            _f.trys.push([8, , 11, 12]);
                            if (!(_c && !_c.done && (_e = _b.return))) return [3 /*break*/, 10];
                            return [4 /*yield*/, __await(_e.call(_b))];
                        case 9:
                            _f.sent();
                            _f.label = 10;
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            if (e_13) throw e_13.error;
                            return [7 /*endfinally*/];
                        case 12: return [7 /*endfinally*/];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
    };
};
exports.drop = drop;
var zip = function (bs) {
    return function (as) {
        return function () {
            return __asyncGenerator(this, arguments, function () {
                var _bs, _b, _c, a, b, e_14_1;
                var e_14, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _bs = bs();
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 9, 10, 15]);
                            _b = __asyncValues(as());
                            _e.label = 2;
                        case 2: return [4 /*yield*/, __await(_b.next())];
                        case 3:
                            if (!(_c = _e.sent(), !_c.done)) return [3 /*break*/, 8];
                            a = _c.value;
                            return [4 /*yield*/, __await(_bs.next())];
                        case 4:
                            b = _e.sent();
                            if (b.done) {
                                return [3 /*break*/, 8];
                            }
                            return [4 /*yield*/, __await([a, b.value])];
                        case 5: return [4 /*yield*/, _e.sent()];
                        case 6:
                            _e.sent();
                            _e.label = 7;
                        case 7: return [3 /*break*/, 2];
                        case 8: return [3 /*break*/, 15];
                        case 9:
                            e_14_1 = _e.sent();
                            e_14 = { error: e_14_1 };
                            return [3 /*break*/, 15];
                        case 10:
                            _e.trys.push([10, , 13, 14]);
                            if (!(_c && !_c.done && (_d = _b.return))) return [3 /*break*/, 12];
                            return [4 /*yield*/, __await(_d.call(_b))];
                        case 11:
                            _e.sent();
                            _e.label = 12;
                        case 12: return [3 /*break*/, 14];
                        case 13:
                            if (e_14) throw e_14.error;
                            return [7 /*endfinally*/];
                        case 14: return [7 /*endfinally*/];
                        case 15: return [2 /*return*/];
                    }
                });
            });
        };
    };
};
exports.zip = zip;
var uniq = function (E) {
    return exports.sieve(function (init, a) { return !function_1.pipe(init, RA.elem(E)(a)); });
};
exports.uniq = uniq;
var match = function (onEmpty, onNonEmpty) {
    return function (as) {
        return function_1.pipe(as().next(), function (a) { return function () {
            return a.then(function (_a) {
                return _a.done ? onEmpty() : onNonEmpty(_a.value, function_1.pipe(as, exports.drop(1)));
            });
        }; });
    };
};
exports.match = match;
var toTask = function (as) {
    return function () { return __awaiter(void 0, void 0, void 0, function () {
        var _as, _b, _c, a, e_15_1;
        var e_15, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _as = [];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 6, 7, 12]);
                    _b = __asyncValues(as());
                    _e.label = 2;
                case 2: return [4 /*yield*/, _b.next()];
                case 3:
                    if (!(_c = _e.sent(), !_c.done)) return [3 /*break*/, 5];
                    a = _c.value;
                    _as.push(a);
                    _e.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_15_1 = _e.sent();
                    e_15 = { error: e_15_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _e.trys.push([7, , 10, 11]);
                    if (!(_c && !_c.done && (_d = _b.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _d.call(_b)];
                case 8:
                    _e.sent();
                    _e.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_15) throw e_15.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/, _as];
            }
        });
    }); };
};
exports.toTask = toTask;
exports.isEmpty = exports.match(function_1.constTrue, function_1.constFalse);
exports.isNonEmpty = function_1.flow(exports.isEmpty, T.map(function (a) { return !a; }));
var lookup = function (i) {
    return function (as) {
        return i < 0
            ? T.of(O.none)
            : function_1.pipe(as, exports.drop(i), exports.match(function () { return O.none; }, function (a) { return O.some(a); }));
    };
};
exports.lookup = lookup;
var head = function (as) {
    return function_1.pipe(as, exports.lookup(0));
};
exports.head = head;
function find(predicate) {
    var _this = this;
    return function (as) { return function () { return __awaiter(_this, void 0, void 0, function () {
        var _b, _c, a, e_16_1;
        var e_16, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, 6, 11]);
                    _b = __asyncValues(as());
                    _e.label = 1;
                case 1: return [4 /*yield*/, _b.next()];
                case 2:
                    if (!(_c = _e.sent(), !_c.done)) return [3 /*break*/, 4];
                    a = _c.value;
                    if (predicate(a)) {
                        return [2 /*return*/, O.some(a)];
                    }
                    _e.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 11];
                case 5:
                    e_16_1 = _e.sent();
                    e_16 = { error: e_16_1 };
                    return [3 /*break*/, 11];
                case 6:
                    _e.trys.push([6, , 9, 10]);
                    if (!(_c && !_c.done && (_d = _b.return))) return [3 /*break*/, 8];
                    return [4 /*yield*/, _d.call(_b)];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    if (e_16) throw e_16.error;
                    return [7 /*endfinally*/];
                case 10: return [7 /*endfinally*/];
                case 11: return [2 /*return*/, O.none];
            }
        });
    }); }; };
}
exports.find = find;
var elem = function (Eq) {
    return function (a) {
        return find(function (_a) { return Eq.equals(a, _a); });
    };
};
exports.elem = elem;
