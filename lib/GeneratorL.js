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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterWithIndex = exports.FilterableWithIndex = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = exports.Filterable = exports.separate = exports.compact = exports.Compactable = exports.duplicate = exports.extend = exports.Extend = exports.zero = exports.Alternative = exports.alt = exports.Alt = exports.unfold = exports.Unfoldable = exports.MonadIO = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.fromIO = exports.FromIO = exports.Monad = exports.chainWithIndex = exports.bind = exports.chainFirst = exports.chain = exports.Chain = exports.Applicative = exports.apS = exports.apSecond = exports.apFirst = exports.ap = exports.Apply = exports.mapWithIndex = exports.FunctorWithIndex = exports.Do = exports.of = exports.Pointed = exports.bindTo = exports.flap = exports.map = exports.Functor = exports.getOrd = exports.getEq = exports.getMonoid = exports.URI = void 0;
exports.zip = exports.zipWith = exports.reverse = exports.sortBy = exports.sort = exports.uniq = exports.sieve = exports.scanRight = exports.scanLeft = exports.dropLeftWhile = exports.dropRight = exports.dropLeft = exports.takeLeftWhile = exports.takeRight = exports.takeLeft = exports.append = exports.prepend = exports.flatten = exports.fibonacci = exports.exp = exports.prime = exports.randomElem = exports.randomBool = exports.randomRange = exports.randomInt = exports.random = exports.fromReadonlyRecord = exports.fromReadonlyArray = exports.replicate = exports.range = exports.makeBy = exports.wither = exports.wilt = exports.Witherable = exports.traverseWithIndex = exports.TraversableWithIndex = exports.traverse = exports.Traversable = exports.sequence = exports.reduceRightWithIndex = exports.foldMapWithIndex = exports.reduceWithIndex = exports.FoldableWithIndex = exports.reduceRight = exports.foldMap = exports.reduce = exports.Foldable = exports.partitionMapWithIndex = exports.partitionWithIndex = exports.filterMapWithIndex = void 0;
exports.deleteAt = exports.updateAt = exports.modifyAt = exports.insertAt = exports.elem = exports.findLastIndex = exports.findLastMap = exports.findLast = exports.findFirstIndex = exports.findFirstMap = exports.findFirst = exports.isOutOfBound = exports.size = exports.isNonEmpty = exports.isEmpty = exports.unzip = exports.splitAt = exports.spanLeft = exports.init = exports.tail = exports.last = exports.head = exports.lookup = exports.toReadonlyArray = exports.matchRight = exports.matchLeft = exports.chunksOf = exports.chop = exports.rotate = exports.intersperse = exports.prependAll = exports.lefts = exports.rights = void 0;
var _Apply = __importStar(require("fp-ts/Apply"));
var Ch = __importStar(require("fp-ts/Chain"));
var Ei = __importStar(require("fp-ts/Either"));
var Eq = __importStar(require("fp-ts/Eq"));
var FIO = __importStar(require("fp-ts/FromIO"));
var function_1 = require("fp-ts/function");
var Fu = __importStar(require("fp-ts/Functor"));
var Op = __importStar(require("fp-ts/Option"));
var Or = __importStar(require("fp-ts/Ord"));
var R = __importStar(require("fp-ts/Random"));
var RA = __importStar(require("fp-ts/ReadonlyArray"));
var RR = __importStar(require("fp-ts/ReadonlyRecord"));
var S = __importStar(require("fp-ts/Separated"));
var function_2 = require("./function");
exports.URI = 'GeneratorL';
var getMonoid = function () { return ({
    empty: exports.fromReadonlyArray([]),
    concat: function (x, y) {
        return function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [5 /*yield**/, __values(x())];
                    case 1:
                        _c.sent();
                        return [5 /*yield**/, __values(y())];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        };
    },
}); };
exports.getMonoid = getMonoid;
var getEq = function (E) {
    return Eq.fromEquals(function (x, y) {
        var e_1, _c;
        var bs = y();
        try {
            for (var _d = __values(x()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var a = _e.value;
                var b = bs.next();
                if (b.done || !E.equals(a, b.value)) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_c = _d.return)) _c.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return Boolean(bs.next().done);
    });
};
exports.getEq = getEq;
var getOrd = function (O) {
    return Or.fromCompare(function (first, second) {
        var e_2, _c;
        var bs = second();
        try {
            for (var _d = __values(first()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var a = _e.value;
                var b = bs.next();
                if (b.done) {
                    return 1;
                }
                var ordering = O.compare(a, b.value);
                if (0 !== ordering) {
                    return ordering;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_c = _d.return)) _c.call(_d);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return !bs.next().done ? -1 : 0;
    });
};
exports.getOrd = getOrd;
exports.Functor = {
    URI: exports.URI,
    map: function (fa, f) {
        return function () {
            var _c, _d, a, e_3_1;
            var e_3, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 5, 6, 7]);
                        _c = __values(fa()), _d = _c.next();
                        _f.label = 1;
                    case 1:
                        if (!!_d.done) return [3 /*break*/, 4];
                        a = _d.value;
                        return [4 /*yield*/, f(a)];
                    case 2:
                        _f.sent();
                        _f.label = 3;
                    case 3:
                        _d = _c.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_3_1 = _f.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        };
    },
};
exports.map = function_2.curry(function_1.flip(exports.Functor.map));
exports.flap = Fu.flap(exports.Functor);
exports.bindTo = Fu.bindTo(exports.Functor);
exports.Pointed = {
    URI: exports.URI,
    of: function (a) {
        return function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, a];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        };
    },
};
exports.of = exports.Pointed.of;
exports.Do = exports.Pointed.of({});
exports.FunctorWithIndex = __assign(__assign({}, exports.Functor), { mapWithIndex: function (fa, f) {
        return exports.Functor.map(function_1.pipe(fa, exports.zip(exports.range(0))), function (_c) {
            var _d = __read(_c, 2), a = _d[0], i = _d[1];
            return f(i, a);
        });
    } });
exports.mapWithIndex = function_2.curry(function_1.flip(exports.FunctorWithIndex.mapWithIndex));
exports.Apply = __assign(__assign({}, exports.Functor), { ap: function (fab, fa) { return exports.Chain.chain(fab, function_2.curry(exports.Functor.map)(fa)); } });
exports.ap = function_2.curry(function_1.flip(exports.Apply.ap));
exports.apFirst = _Apply.apFirst(exports.Apply);
exports.apSecond = _Apply.apSecond(exports.Apply);
exports.apS = _Apply.apS(exports.Apply);
exports.Applicative = __assign(__assign({}, exports.Pointed), exports.Apply);
exports.Chain = __assign(__assign({}, exports.Apply), { chain: function (fa, f) { return exports.flatten(exports.Functor.map(fa, f)); } });
exports.chain = function_2.curry(function_1.flip(exports.Chain.chain));
exports.chainFirst = Ch.chainFirst(exports.Chain);
exports.bind = Ch.bind(exports.Chain);
var chainWithIndex = function (f) {
    return function (fa) {
        return function_1.pipe(fa, exports.zip(exports.range(0)), exports.chain(function (_c) {
            var _d = __read(_c, 2), a = _d[0], i = _d[1];
            return f(i, a);
        }));
    };
};
exports.chainWithIndex = chainWithIndex;
exports.Monad = __assign(__assign({}, exports.Applicative), exports.Chain);
exports.FromIO = {
    URI: exports.URI,
    fromIO: function (fa) { return function_1.pipe(exports.range(0), exports.map(fa)); },
};
exports.fromIO = exports.FromIO.fromIO;
exports.fromIOK = FIO.fromIOK(exports.FromIO);
exports.chainIOK = FIO.chainIOK(exports.FromIO, exports.Chain);
exports.chainFirstIOK = FIO.chainFirstIOK(exports.FromIO, exports.Chain);
exports.MonadIO = __assign(__assign({}, exports.Monad), exports.FromIO);
exports.Unfoldable = {
    URI: exports.URI,
    unfold: function (b, f) {
        return function () {
            var _b, ab;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = b, ab = f(_b);
                        _c.label = 1;
                    case 1:
                        if (!Op.isSome(ab)) return [3 /*break*/, 4];
                        return [4 /*yield*/, ab.value[0]];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _b = ab.value[1], ab = f(_b);
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        };
    },
};
exports.unfold = function_2.curry(function_1.flip(exports.Unfoldable.unfold));
exports.Alt = __assign(__assign({}, exports.Functor), { alt: function (fa, that) {
        return exports.getMonoid().concat(fa, that());
    } });
exports.alt = function_2.curry(function_1.flip(exports.Alt.alt));
exports.Alternative = __assign(__assign(__assign({}, exports.Applicative), exports.Alt), { zero: function () { return exports.getMonoid().empty; } });
exports.zero = exports.Alternative.zero;
exports.Extend = __assign(__assign({}, exports.Functor), { extend: function (wa, f) {
        return function_1.pipe(wa, exports.mapWithIndex(function (i) { return function_1.pipe(wa, exports.dropLeft(i), f); }));
    } });
exports.extend = function_2.curry(function_1.flip(exports.Extend.extend));
var duplicate = function (fa) { return function_1.pipe(fa, exports.extend(function_1.identity)); };
exports.duplicate = duplicate;
exports.Compactable = {
    URI: exports.URI,
    compact: function (fa) {
        return exports.Functor.map(exports.Filterable.filter(fa, Op.isSome), function (a) { return a.value; });
    },
    separate: function (fa) {
        return S.separated(exports.Functor.map(exports.Filterable.filter(fa, Ei.isLeft), function (a) { return a.left; }), exports.Functor.map(exports.Filterable.filter(fa, Ei.isRight), function (a) { return a.right; }));
    },
};
exports.compact = exports.Compactable.compact;
exports.separate = exports.Compactable.separate;
function _filter(fa, predicate) {
    return function () {
        var _c, _d, a, e_4_1;
        var e_4, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 5, 6, 7]);
                    _c = __values(fa()), _d = _c.next();
                    _f.label = 1;
                case 1:
                    if (!!_d.done) return [3 /*break*/, 4];
                    a = _d.value;
                    if (!predicate(a)) {
                        return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, a];
                case 2:
                    _f.sent();
                    _f.label = 3;
                case 3:
                    _d = _c.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_4_1 = _f.sent();
                    e_4 = { error: e_4_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                    }
                    finally { if (e_4) throw e_4.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    };
}
function _partition(fa, predicate) {
    return S.separated(exports.Filterable.filter(fa, function_1.not(predicate)), exports.Filterable.filter(fa, predicate));
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
        return predicateWithIndex(i, a) ? Op.some(a) : Op.none;
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
exports.Foldable = {
    URI: exports.URI,
    reduce: function (fa, b, f) {
        return exports.FoldableWithIndex.reduceWithIndex(fa, b, function (_, _b, a) { return f(_b, a); });
    },
    foldMap: function (M) { return function (fa, f) {
        return exports.FoldableWithIndex.foldMapWithIndex(M)(fa, function (_, a) { return f(a); });
    }; },
    reduceRight: function (fa, b, f) {
        return exports.FoldableWithIndex.reduceRightWithIndex(fa, b, function (_, a, _b) { return f(a, _b); });
    },
};
var reduce = function (b, f) {
    return function (fa) {
        return exports.Foldable.reduce(fa, b, f);
    };
};
exports.reduce = reduce;
var foldMap = function (M) {
    return function (f) {
        return function (fa) {
            return exports.Foldable.foldMap(M)(fa, f);
        };
    };
};
exports.foldMap = foldMap;
var reduceRight = function (b, f) {
    return function (fa) {
        return exports.Foldable.reduceRight(fa, b, f);
    };
};
exports.reduceRight = reduceRight;
exports.FoldableWithIndex = __assign(__assign({}, exports.Foldable), { reduceWithIndex: function (fa, b, f) {
        return function_1.pipe(fa, exports.zip(exports.range(0)), function (_fa) {
            var e_5, _c;
            var _b = b;
            try {
                for (var _d = __values(_fa()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var _f = __read(_e.value, 2), a = _f[0], i = _f[1];
                    _b = f(i, _b, a);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_c = _d.return)) _c.call(_d);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return _b;
        });
    }, foldMapWithIndex: function (M) { return function (fa, f) {
        return exports.FoldableWithIndex.reduceWithIndex(fa, M.empty, function (i, b, a) {
            return M.concat(b, f(i, a));
        });
    }; }, reduceRightWithIndex: function (fa, b, f) {
        return function_1.pipe(fa, exports.toReadonlyArray, RA.reduceRightWithIndex(b, f));
    } });
var reduceWithIndex = function (b, f) {
    return function (fa) {
        return exports.FoldableWithIndex.reduceWithIndex(fa, b, f);
    };
};
exports.reduceWithIndex = reduceWithIndex;
var foldMapWithIndex = function (M) {
    return function (f) {
        return function (fa) {
            return exports.FoldableWithIndex.foldMapWithIndex(M)(fa, f);
        };
    };
};
exports.foldMapWithIndex = foldMapWithIndex;
var reduceRightWithIndex = function (b, f) {
    return function (fa) {
        return exports.FoldableWithIndex.reduceRightWithIndex(fa, b, f);
    };
};
exports.reduceRightWithIndex = reduceRightWithIndex;
function _traverse(F) {
    return function (ta, f) {
        return exports.TraversableWithIndex.traverseWithIndex(F)(ta, function (_, a) { return f(a); });
    };
}
function sequence(F) {
    return function (ta) { return exports.Traversable.traverse(F)(ta, function_1.identity); };
}
exports.sequence = sequence;
exports.Traversable = __assign(__assign(__assign({}, exports.Functor), exports.Foldable), { traverse: _traverse, sequence: sequence });
function traverse(F) {
    return function (f) {
        return function (ta) {
            return exports.Traversable.traverse(F)(ta, f);
        };
    };
}
exports.traverse = traverse;
function _traverseWithIndex(F) {
    return function (ta, f) {
        return exports.FoldableWithIndex.reduceWithIndex(ta, F.of(exports.zero()), function (i, fbs, a) {
            return F.ap(F.map(fbs, function (bs) { return function (b) { return function_1.pipe(bs, exports.append(b)); }; }), f(i, a));
        });
    };
}
exports.TraversableWithIndex = __assign(__assign(__assign(__assign({}, exports.FunctorWithIndex), exports.FoldableWithIndex), exports.Traversable), { traverseWithIndex: _traverseWithIndex });
function traverseWithIndex(F) {
    return function (f) {
        return function (ta) {
            return exports.TraversableWithIndex.traverseWithIndex(F)(ta, f);
        };
    };
}
exports.traverseWithIndex = traverseWithIndex;
function _wilt(F) {
    return function (wa, f) {
        return F.map(exports.Traversable.traverse(F)(wa, f), exports.separate);
    };
}
function _wither(F) {
    return function (ta, f) {
        return F.map(exports.Traversable.traverse(F)(ta, f), exports.compact);
    };
}
exports.Witherable = __assign(__assign(__assign({}, exports.Traversable), exports.Filterable), { wilt: _wilt, wither: _wither });
function wilt(F) {
    return function (f) {
        return function (wa) {
            return exports.Witherable.wilt(F)(wa, f);
        };
    };
}
exports.wilt = wilt;
function wither(F) {
    return function (f) {
        return function (ta) {
            return exports.Witherable.wither(F)(ta, f);
        };
    };
}
exports.wither = wither;
var makeBy = function (f) {
    return function () {
        var i;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 4];
                    return [4 /*yield*/, f(i)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
};
exports.makeBy = makeBy;
var range = function (start, end) {
    if (end === void 0) { end = Infinity; }
    return function_1.pipe(exports.makeBy(function (i) { return start + i; }), takeLeftWhile(function (n) { return n <= Math.max(start, end); }));
};
exports.range = range;
var replicate = function (a) { return exports.makeBy(function () { return a; }); };
exports.replicate = replicate;
var fromReadonlyArray = function (as) {
    return function () {
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [5 /*yield**/, __values(as)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    };
};
exports.fromReadonlyArray = fromReadonlyArray;
exports.fromReadonlyRecord = RR.toUnfoldable(exports.Unfoldable);
exports.random = exports.fromIO(R.random);
var randomInt = function (low, high) {
    return exports.fromIO(R.randomInt(Math.floor(low), Math.max(Math.floor(low), Math.floor(high))));
};
exports.randomInt = randomInt;
var randomRange = function (min, max) {
    return exports.fromIO(R.randomRange(min, Math.max(min, max)));
};
exports.randomRange = randomRange;
exports.randomBool = exports.fromIO(R.randomBool);
var randomElem = function (as) { return exports.fromIO(R.randomElem(as)); };
exports.randomElem = randomElem;
exports.prime = function_1.pipe(exports.range(2), sieve(function (init, n) {
    return function_1.pipe(init, RA.every(function (_n) { return 0 !== n % _n; }));
}));
exports.exp = exports.makeBy(function (n) { return Math.exp(n); });
var fibonacci = function () {
    var ns;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                ns = [1, 0];
                _c.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 4];
                return [4 /*yield*/, ns[1]];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3:
                ns = [ns[1], ns[0] + ns[1]];
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
};
exports.fibonacci = fibonacci;
var flatten = function (mma) {
    return function () {
        var _c, _d, ma, e_6_1;
        var e_6, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 5, 6, 7]);
                    _c = __values(mma()), _d = _c.next();
                    _f.label = 1;
                case 1:
                    if (!!_d.done) return [3 /*break*/, 4];
                    ma = _d.value;
                    return [5 /*yield**/, __values(ma())];
                case 2:
                    _f.sent();
                    _f.label = 3;
                case 3:
                    _d = _c.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_6_1 = _f.sent();
                    e_6 = { error: e_6_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                    }
                    finally { if (e_6) throw e_6.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    };
};
exports.flatten = flatten;
var prepend = function (a) {
    return function (ma) {
        return function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, a];
                    case 1:
                        _c.sent();
                        return [5 /*yield**/, __values(ma())];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        };
    };
};
exports.prepend = prepend;
var append = function (a) {
    return function (ma) {
        return function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [5 /*yield**/, __values(ma())];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, a];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        };
    };
};
exports.append = append;
var takeLeft = function (n) {
    return function (ma) {
        return function () {
            var _c, _d, _e, a, i, e_7_1;
            var e_7, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 5, 6, 7]);
                        _c = __values(function_1.pipe(ma, exports.zip(exports.range(0)))()), _d = _c.next();
                        _g.label = 1;
                    case 1:
                        if (!!_d.done) return [3 /*break*/, 4];
                        _e = __read(_d.value, 2), a = _e[0], i = _e[1];
                        if (i >= n) {
                            return [3 /*break*/, 4];
                        }
                        return [4 /*yield*/, a];
                    case 2:
                        _g.sent();
                        _g.label = 3;
                    case 3:
                        _d = _c.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_7_1 = _g.sent();
                        e_7 = { error: e_7_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                        }
                        finally { if (e_7) throw e_7.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        };
    };
};
exports.takeLeft = takeLeft;
var takeRight = function (n) {
    return function (ma) {
        return function_1.pipe(ma, exports.toReadonlyArray, RA.takeRight(n), exports.fromReadonlyArray);
    };
};
exports.takeRight = takeRight;
function takeLeftWhile(predicate) {
    return function (ma) {
        return function () {
            var _c, _d, a, e_8_1;
            var e_8, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 5, 6, 7]);
                        _c = __values(ma()), _d = _c.next();
                        _f.label = 1;
                    case 1:
                        if (!!_d.done) return [3 /*break*/, 4];
                        a = _d.value;
                        if (!predicate(a)) {
                            return [3 /*break*/, 4];
                        }
                        return [4 /*yield*/, a];
                    case 2:
                        _f.sent();
                        _f.label = 3;
                    case 3:
                        _d = _c.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_8_1 = _f.sent();
                        e_8 = { error: e_8_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                        }
                        finally { if (e_8) throw e_8.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        };
    };
}
exports.takeLeftWhile = takeLeftWhile;
var dropLeft = function (n) {
    return function (ma) {
        return function () {
            var _c, _d, _e, a, i, e_9_1;
            var e_9, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 5, 6, 7]);
                        _c = __values(function_1.pipe(ma, exports.zip(exports.range(0)))()), _d = _c.next();
                        _g.label = 1;
                    case 1:
                        if (!!_d.done) return [3 /*break*/, 4];
                        _e = __read(_d.value, 2), a = _e[0], i = _e[1];
                        if (i < n) {
                            return [3 /*break*/, 3];
                        }
                        return [4 /*yield*/, a];
                    case 2:
                        _g.sent();
                        _g.label = 3;
                    case 3:
                        _d = _c.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_9_1 = _g.sent();
                        e_9 = { error: e_9_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                        }
                        finally { if (e_9) throw e_9.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        };
    };
};
exports.dropLeft = dropLeft;
var dropRight = function (n) {
    return function (ma) {
        return function_1.pipe(ma, exports.toReadonlyArray, RA.dropRight(n), exports.fromReadonlyArray);
    };
};
exports.dropRight = dropRight;
function dropLeftWhile(predicate) {
    return function (ma) {
        return function () {
            var as, a;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        as = ma();
                        a = as.next();
                        while (!a.done && predicate(a.value)) {
                            a = as.next();
                        }
                        if (!!a.done) return [3 /*break*/, 2];
                        return [4 /*yield*/, a.value];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2: return [5 /*yield**/, __values(as)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        };
    };
}
exports.dropLeftWhile = dropLeftWhile;
var scanLeft = function (b, f) {
    return function (ma) {
        return function () {
            var _b, _c, _d, a, e_10_1;
            var e_10, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, b];
                    case 1:
                        _f.sent();
                        _b = b;
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, 7, 8, 9]);
                        _c = __values(ma()), _d = _c.next();
                        _f.label = 3;
                    case 3:
                        if (!!_d.done) return [3 /*break*/, 6];
                        a = _d.value;
                        _b = f(_b, a);
                        return [4 /*yield*/, _b];
                    case 4:
                        _f.sent();
                        _f.label = 5;
                    case 5:
                        _d = _c.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_10_1 = _f.sent();
                        e_10 = { error: e_10_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                        }
                        finally { if (e_10) throw e_10.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        };
    };
};
exports.scanLeft = scanLeft;
var scanRight = function (b, f) {
    return function (ma) {
        return function_1.pipe(ma, exports.scanLeft(b, function (b, a) { return f(a, b); }), exports.reverse);
    };
};
exports.scanRight = scanRight;
function sieve(f) {
    return function (ma) {
        return function () {
            var init, _c, _d, a, e_11_1;
            var e_11, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        init = [];
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 6, 7, 8]);
                        _c = __values(ma()), _d = _c.next();
                        _f.label = 2;
                    case 2:
                        if (!!_d.done) return [3 /*break*/, 5];
                        a = _d.value;
                        if (!f(init, a)) {
                            return [3 /*break*/, 4];
                        }
                        init.push(a);
                        return [4 /*yield*/, a];
                    case 3:
                        _f.sent();
                        _f.label = 4;
                    case 4:
                        _d = _c.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_11_1 = _f.sent();
                        e_11 = { error: e_11_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                        }
                        finally { if (e_11) throw e_11.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        };
    };
}
exports.sieve = sieve;
var uniq = function (E) {
    return sieve(function (init, a) { return !function_1.pipe(init, RA.elem(E)(a)); });
};
exports.uniq = uniq;
var sort = function (O) { return exports.sortBy([O]); };
exports.sort = sort;
var sortBy = function (Os) {
    return function (ma) {
        return function_1.pipe(ma, exports.toReadonlyArray, RA.sortBy(Os), exports.fromReadonlyArray);
    };
};
exports.sortBy = sortBy;
var reverse = function (ma) {
    return function () {
        var as, i;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    as = exports.toReadonlyArray(ma);
                    i = as.length - 1;
                    _c.label = 1;
                case 1:
                    if (!(i >= 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, as[i]];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    i--;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
};
exports.reverse = reverse;
var zipWith = function (mb, f) {
    return function (ma) {
        return function () {
            var bs, _c, _d, a, b, e_12_1;
            var e_12, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        bs = mb();
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 6, 7, 8]);
                        _c = __values(ma()), _d = _c.next();
                        _f.label = 2;
                    case 2:
                        if (!!_d.done) return [3 /*break*/, 5];
                        a = _d.value;
                        b = bs.next();
                        if (b.done) {
                            return [3 /*break*/, 5];
                        }
                        return [4 /*yield*/, f(a, b.value)];
                    case 3:
                        _f.sent();
                        _f.label = 4;
                    case 4:
                        _d = _c.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_12_1 = _f.sent();
                        e_12 = { error: e_12_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                        }
                        finally { if (e_12) throw e_12.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        };
    };
};
exports.zipWith = zipWith;
var zip = function (mb) {
    return function (ma) {
        return function_1.pipe(ma, exports.zipWith(mb, function (a, b) { return [a, b]; }));
    };
};
exports.zip = zip;
var rights = function (ma) {
    return function_1.pipe(ma, exports.filterMap(Op.fromEither));
};
exports.rights = rights;
var lefts = function (ma) {
    return function_1.pipe(ma, filter(Ei.isLeft), exports.map(function (e) { return e.left; }));
};
exports.lefts = lefts;
var prependAll = function (middle) {
    return function (ma) {
        return function_1.pipe(ma, exports.matchLeft(function () { return ma; }, function () {
            return function () {
                var _c, _d, a, e_13_1;
                var e_13, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _f.trys.push([0, 6, 7, 8]);
                            _c = __values(ma()), _d = _c.next();
                            _f.label = 1;
                        case 1:
                            if (!!_d.done) return [3 /*break*/, 5];
                            a = _d.value;
                            return [4 /*yield*/, middle];
                        case 2:
                            _f.sent();
                            return [4 /*yield*/, a];
                        case 3:
                            _f.sent();
                            _f.label = 4;
                        case 4:
                            _d = _c.next();
                            return [3 /*break*/, 1];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_13_1 = _f.sent();
                            e_13 = { error: e_13_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                            }
                            finally { if (e_13) throw e_13.error; }
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            };
        }));
    };
};
exports.prependAll = prependAll;
var intersperse = function (middle) {
    return function_1.flow(exports.prependAll(middle), exports.dropLeft(1));
};
exports.intersperse = intersperse;
var rotate = function (n) {
    return function (ma) {
        return function_1.pipe(ma, exports.toReadonlyArray, RA.rotate(n), exports.fromReadonlyArray);
    };
};
exports.rotate = rotate;
var chop = function (f) {
    return function (ma) {
        return function () {
            var _isNonEmpty, _c, b, _ma;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _isNonEmpty = exports.isNonEmpty(ma), _c = __read(f(ma), 2), b = _c[0], _ma = _c[1];
                        _e.label = 1;
                    case 1:
                        if (!_isNonEmpty) return [3 /*break*/, 4];
                        return [4 /*yield*/, b];
                    case 2:
                        _e.sent();
                        _e.label = 3;
                    case 3:
                        _isNonEmpty = exports.isNonEmpty(_ma), (_d = __read(f(_ma), 2), b = _d[0], _ma = _d[1]);
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        };
    };
};
exports.chop = chop;
var chunksOf = function (n) {
    return function (ma) {
        return function_1.pipe(ma, exports.chop(exports.splitAt(Math.max(1, n))));
    };
};
exports.chunksOf = chunksOf;
var matchLeft = function (onEmpty, onNonEmpty) {
    return function (ma) {
        return function_1.pipe(ma().next(), function (a) {
            return a.done ? onEmpty() : onNonEmpty(a.value, function_1.pipe(ma, exports.dropLeft(1)));
        });
    };
};
exports.matchLeft = matchLeft;
var matchRight = function (onEmpty, onNonEmpty) {
    return function (ma) {
        return function_1.pipe(ma, exports.zip(exports.range(0)), exports.last, Op.match(onEmpty, function (_c) {
            var _d = __read(_c, 2), a = _d[0], i = _d[1];
            return onNonEmpty(function_1.pipe(ma, filterWithIndex(function (_i) { return i !== _i; })), a);
        }));
    };
};
exports.matchRight = matchRight;
var toReadonlyArray = function (ma) { return __spreadArray([], __read(ma())); };
exports.toReadonlyArray = toReadonlyArray;
var lookup = function (i) {
    return function (ma) {
        return i < 0
            ? Op.none
            : function_1.pipe(ma, exports.dropLeft(i), exports.matchLeft(function () { return Op.none; }, Op.some));
    };
};
exports.lookup = lookup;
exports.head = exports.lookup(0);
var last = function (ma) {
    var e_14, _c;
    var last = Op.none;
    try {
        for (var _d = __values(ma()), _e = _d.next(); !_e.done; _e = _d.next()) {
            var a = _e.value;
            last = Op.some(a);
        }
    }
    catch (e_14_1) { e_14 = { error: e_14_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_c = _d.return)) _c.call(_d);
        }
        finally { if (e_14) throw e_14.error; }
    }
    return last;
};
exports.last = last;
var tail = function (ma) {
    return function_1.pipe(ma, exports.matchLeft(function () { return Op.none; }, function (_, tail) { return Op.some(tail); }));
};
exports.tail = tail;
var init = function (ma) {
    return function_1.pipe(ma, exports.matchRight(function () { return Op.none; }, Op.some));
};
exports.init = init;
function spanLeft(predicate) {
    return function (ma) {
        var i = function_1.pipe(ma, exports.findFirstIndex(function_1.not(predicate)), Op.getOrElse(function () { return Infinity; }));
        var _c = __read(function_1.pipe(ma, exports.splitAt(i)), 2), init = _c[0], rest = _c[1];
        return { init: init, rest: rest };
    };
}
exports.spanLeft = spanLeft;
var splitAt = function (n) {
    return function (ma) {
        return [function_1.pipe(ma, exports.takeLeft(n)), function_1.pipe(ma, exports.dropLeft(n))];
    };
};
exports.splitAt = splitAt;
var unzip = function (mab) { return [
    function_1.pipe(mab, exports.map(function (_c) {
        var _d = __read(_c, 1), a = _d[0];
        return a;
    })),
    function_1.pipe(mab, exports.map(function (_c) {
        var _d = __read(_c, 2), _ = _d[0], b = _d[1];
        return b;
    })),
]; };
exports.unzip = unzip;
exports.isEmpty = exports.matchLeft(function_1.constTrue, function_1.constFalse);
exports.isNonEmpty = function_1.not(exports.isEmpty);
exports.size = function_1.flow(exports.mapWithIndex(function_1.identity), exports.last, Op.match(function () { return 0; }, function (i) { return 1 + i; }));
var isOutOfBound = function (n) {
    return function (ma) {
        return n >= 0 && n < exports.size(ma);
    };
};
exports.isOutOfBound = isOutOfBound;
function findFirst(predicate) {
    return function (ma) {
        var e_15, _c;
        try {
            for (var _d = __values(ma()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var a = _e.value;
                if (predicate(a)) {
                    return Op.some(a);
                }
            }
        }
        catch (e_15_1) { e_15 = { error: e_15_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_c = _d.return)) _c.call(_d);
            }
            finally { if (e_15) throw e_15.error; }
        }
        return Op.none;
    };
}
exports.findFirst = findFirst;
var findFirstMap = function (f) {
    return function (ma) {
        var e_16, _c;
        try {
            for (var _d = __values(ma()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var a = _e.value;
                var b = f(a);
                if (Op.isSome(b)) {
                    return b;
                }
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_c = _d.return)) _c.call(_d);
            }
            finally { if (e_16) throw e_16.error; }
        }
        return Op.none;
    };
};
exports.findFirstMap = findFirstMap;
var findFirstIndex = function (predicate) {
    return function (ma) {
        return function_1.pipe(ma, exports.zip(exports.range(0)), findFirst(function (_c) {
            var _d = __read(_c, 1), a = _d[0];
            return predicate(a);
        }), Op.map(function (_c) {
            var _d = __read(_c, 2), _ = _d[0], i = _d[1];
            return i;
        }));
    };
};
exports.findFirstIndex = findFirstIndex;
function findLast(predicate) {
    return function (ma) { return function_1.pipe(ma, exports.reverse, findFirst(predicate)); };
}
exports.findLast = findLast;
var findLastMap = function (f) {
    return function (ma) {
        return function_1.pipe(ma, exports.reverse, exports.findFirstMap(f));
    };
};
exports.findLastMap = findLastMap;
var findLastIndex = function (predicate) {
    return function (ma) {
        return function_1.pipe(ma, exports.zip(exports.range(0)), exports.findLastMap(function (_c) {
            var _d = __read(_c, 2), a = _d[0], i = _d[1];
            return (predicate(a) ? Op.some(i) : Op.none);
        }));
    };
};
exports.findLastIndex = findLastIndex;
var elem = function (Eq) {
    return function (a) {
        return findFirst(function (_a) { return Eq.equals(a, _a); });
    };
};
exports.elem = elem;
var insertAt = function (i, a) {
    return function (ma) {
        return function_1.pipe(ma, exports.lookup(i), Op.map(function () {
            return function () {
                var _c, _d, _e, _a, _i, e_17_1;
                var e_17, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _g.trys.push([0, 7, 8, 9]);
                            _c = __values(function_1.pipe(ma, exports.zip(exports.range(0)))()), _d = _c.next();
                            _g.label = 1;
                        case 1:
                            if (!!_d.done) return [3 /*break*/, 6];
                            _e = __read(_d.value, 2), _a = _e[0], _i = _e[1];
                            if (!(i === _i)) return [3 /*break*/, 3];
                            return [4 /*yield*/, a];
                        case 2:
                            _g.sent();
                            _g.label = 3;
                        case 3: return [4 /*yield*/, _a];
                        case 4:
                            _g.sent();
                            _g.label = 5;
                        case 5:
                            _d = _c.next();
                            return [3 /*break*/, 1];
                        case 6: return [3 /*break*/, 9];
                        case 7:
                            e_17_1 = _g.sent();
                            e_17 = { error: e_17_1 };
                            return [3 /*break*/, 9];
                        case 8:
                            try {
                                if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                            }
                            finally { if (e_17) throw e_17.error; }
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/];
                    }
                });
            };
        }));
    };
};
exports.insertAt = insertAt;
var modifyAt = function (i, f) {
    return function (ma) {
        return function_1.pipe(ma, exports.lookup(i), Op.map(function () {
            return function_1.pipe(ma, exports.mapWithIndex(function (_i, a) { return (i === _i ? f(a) : a); }));
        }));
    };
};
exports.modifyAt = modifyAt;
var updateAt = function (i, a) { return exports.modifyAt(i, function () { return a; }); };
exports.updateAt = updateAt;
var deleteAt = function (i) {
    return function (ma) {
        return function_1.pipe(ma, exports.lookup(i), Op.map(function () {
            return function_1.pipe(ma, filterWithIndex(function (_i) { return i !== _i; }));
        }));
    };
};
exports.deleteAt = deleteAt;
