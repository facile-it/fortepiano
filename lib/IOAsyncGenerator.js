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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sieve = exports.fromReadonlyArray = exports.replicate = exports.range = exports.partitionMapWithIndex = exports.partitionWithIndex = exports.filterMapWithIndex = exports.filterWithIndex = exports.FilterableWithIndex = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = exports.Filterable = exports.separate = exports.compact = exports.Compactable = exports.MonadIO = exports.chainIOReadonlyArrayK = exports.fromIOReadonlyArrayK = exports.fromIOReadonlyArray = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.fromIO = exports.FromIO = exports.Monad = exports.bind = exports.chainFirst = exports.chain = exports.Chain = exports.ApplicativeSeq = exports.ApplicativePar = exports.apS = exports.apSecond = exports.apFirst = exports.ap = exports.ApplySeq = exports.ApplyPar = exports.Do = exports.of = exports.Pointed = exports.FunctorWithIndex = exports.bindTo = exports.flap = exports.map = exports.Functor = exports.fromIOGenerator = exports.getMonoid = exports.URI = void 0;
exports.elem = exports.find = exports.head = exports.lookup = exports.isNonEmpty = exports.isEmpty = exports.toTask = exports.match = exports.uniq = exports.zip = exports.drop = exports.take = exports.flatten = exports.fibonacci = exports.exp = exports.prime = void 0;
const _Apply = __importStar(require("fp-ts/Apply"));
const Ch = __importStar(require("fp-ts/Chain"));
const Ei = __importStar(require("fp-ts/Either"));
const FIO = __importStar(require("fp-ts/FromIO"));
const function_1 = require("fp-ts/function");
const Fu = __importStar(require("fp-ts/Functor"));
const O = __importStar(require("fp-ts/Option"));
const RA = __importStar(require("fp-ts/ReadonlyArray"));
const S = __importStar(require("fp-ts/Separated"));
const T = __importStar(require("fp-ts/Task"));
const function_2 = require("./function");
const $IOG = __importStar(require("./GeneratorL"));
exports.URI = 'IOAsyncGenerator';
const getMonoid = () => ({
    empty: exports.fromReadonlyArray([]),
    concat: (x, y) => function () {
        return __asyncGenerator(this, arguments, function* () {
            yield __await(yield* __asyncDelegator(__asyncValues(x())));
            yield __await(yield* __asyncDelegator(__asyncValues(y())));
        });
    },
});
exports.getMonoid = getMonoid;
const fromIOGenerator = (as) => function () {
    return __asyncGenerator(this, arguments, function* () {
        for (const a of as()) {
            yield yield __await(a);
        }
    });
};
exports.fromIOGenerator = fromIOGenerator;
exports.Functor = {
    URI: exports.URI,
    map: (fa, f) => function () {
        return __asyncGenerator(this, arguments, function* () {
            var e_1, _b;
            try {
                for (var _c = __asyncValues(fa()), _d; _d = yield __await(_c.next()), !_d.done;) {
                    const a = _d.value;
                    yield yield __await(f(a));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) yield __await(_b.call(_c));
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    },
};
exports.map = function_2.curry(function_1.flip(exports.Functor.map));
exports.flap = Fu.flap(exports.Functor);
exports.bindTo = Fu.bindTo(exports.Functor);
exports.FunctorWithIndex = Object.assign(Object.assign({}, exports.Functor), { mapWithIndex: (fa, f) => exports.Functor.map(function_1.pipe(fa, exports.zip(exports.range(0))), ([a, i]) => f(i, a)) });
exports.Pointed = {
    URI: exports.URI,
    of: (a) => exports.fromIOGenerator($IOG.of(a)),
};
exports.of = exports.Pointed.of;
exports.Do = exports.Pointed.of({});
exports.ApplyPar = Object.assign(Object.assign({}, exports.Functor), { ap: (fab, fa) => function () {
        return __asyncGenerator(this, arguments, function* () {
            const _fab = fab();
            const _fa = fa();
            const abs = [];
            const as = [];
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const [ab, a] = yield __await(Promise.all([_fab.next(), _fa.next()]));
                if (ab.done && a.done) {
                    break;
                }
                if (!ab.done) {
                    abs.push(ab.value);
                }
                if (!a.done) {
                    as.push(a.value);
                }
            }
            for (const ab of abs) {
                for (const a of as) {
                    yield yield __await(ab(a));
                }
            }
        });
    } });
/**
 *
 */
exports.ApplySeq = Object.assign(Object.assign({}, exports.Functor), { ap: (fab, fa) => function () {
        return __asyncGenerator(this, arguments, function* () {
            var e_2, _b, e_3, _c;
            const abs = [];
            try {
                for (var _d = __asyncValues(fab()), _e; _e = yield __await(_d.next()), !_e.done;) {
                    const ab = _e.value;
                    abs.push(ab);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) yield __await(_b.call(_d));
                }
                finally { if (e_2) throw e_2.error; }
            }
            const as = [];
            try {
                for (var _f = __asyncValues(fa()), _g; _g = yield __await(_f.next()), !_g.done;) {
                    const a = _g.value;
                    as.push(a);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_c = _f.return)) yield __await(_c.call(_f));
                }
                finally { if (e_3) throw e_3.error; }
            }
            for (const ab of abs) {
                for (const a of as) {
                    yield yield __await(ab(a));
                }
            }
        });
    } });
exports.ap = function_2.curry(function_1.flip(exports.ApplyPar.ap));
exports.apFirst = _Apply.apFirst(exports.ApplyPar);
exports.apSecond = _Apply.apSecond(exports.ApplyPar);
exports.apS = _Apply.apS(exports.ApplyPar);
exports.ApplicativePar = Object.assign(Object.assign({}, exports.Pointed), exports.ApplyPar);
exports.ApplicativeSeq = Object.assign(Object.assign({}, exports.Pointed), exports.ApplySeq);
exports.Chain = Object.assign(Object.assign({}, exports.ApplySeq), { chain: (fa, f) => {
        return exports.flatten(exports.Functor.map(fa, f));
    } });
exports.chain = function_2.curry(function_1.flip(exports.Chain.chain));
exports.chainFirst = Ch.chainFirst(exports.Chain);
exports.bind = Ch.bind(exports.Chain);
exports.Monad = Object.assign(Object.assign({}, exports.ApplicativeSeq), exports.Chain);
exports.FromIO = {
    URI: exports.URI,
    fromIO: (fa) => () => exports.Pointed.of(fa())(),
};
exports.fromIO = exports.FromIO.fromIO;
exports.fromIOK = FIO.fromIOK(exports.FromIO);
exports.chainIOK = FIO.chainIOK(exports.FromIO, exports.Chain);
exports.chainFirstIOK = FIO.chainFirstIOK(exports.FromIO, exports.Chain);
const fromIOReadonlyArray = (fa) => function_1.pipe(fa, exports.fromIO, exports.chain(exports.fromReadonlyArray));
exports.fromIOReadonlyArray = fromIOReadonlyArray;
const fromIOReadonlyArrayK = (f) => function_1.flow(f, exports.fromIOReadonlyArray);
exports.fromIOReadonlyArrayK = fromIOReadonlyArrayK;
const chainIOReadonlyArrayK = (f) => exports.chain(exports.fromIOReadonlyArrayK(f));
exports.chainIOReadonlyArrayK = chainIOReadonlyArrayK;
exports.MonadIO = Object.assign(Object.assign({}, exports.Monad), exports.FromIO);
function _filter(fa, predicate) {
    return function () {
        return __asyncGenerator(this, arguments, function* () {
            var e_4, _b;
            try {
                for (var _c = __asyncValues(fa()), _d; _d = yield __await(_c.next()), !_d.done;) {
                    const a = _d.value;
                    if (!predicate(a)) {
                        continue;
                    }
                    yield yield __await(a);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) yield __await(_b.call(_c));
                }
                finally { if (e_4) throw e_4.error; }
            }
        });
    };
}
exports.Compactable = {
    URI: exports.URI,
    compact: (fa) => exports.Functor.map(exports.Filterable.filter(fa, O.isSome), (a) => a.value),
    separate: (fa) => S.separated(exports.Functor.map(_filter(fa, Ei.isLeft), (a) => a.left), exports.Functor.map(_filter(fa, Ei.isRight), (a) => a.right)),
};
exports.compact = exports.Compactable.compact;
exports.separate = exports.Compactable.separate;
function _partition(fa, predicate) {
    return S.separated(_filter(fa, function_1.not(predicate)), _filter(fa, predicate));
}
exports.Filterable = Object.assign(Object.assign(Object.assign({}, exports.Functor), exports.Compactable), { filter: _filter, filterMap: (fa, f) => exports.Compactable.compact(exports.Functor.map(fa, f)), partition: _partition, partitionMap: (fa, f) => exports.Compactable.separate(exports.Functor.map(fa, f)) });
function filter(predicate) {
    return (fa) => exports.Filterable.filter(fa, predicate);
}
exports.filter = filter;
exports.filterMap = function_2.curry(function_1.flip(exports.Filterable.filterMap));
function partition(predicate) {
    return (fa) => exports.Filterable.partition(fa, predicate);
}
exports.partition = partition;
exports.partitionMap = function_2.curry(function_1.flip(exports.Filterable.partitionMap));
function _filterWithIndex(fa, predicateWithIndex) {
    return exports.Compactable.compact(exports.FunctorWithIndex.mapWithIndex(fa, (i, a) => predicateWithIndex(i, a) ? O.some(a) : O.none));
}
function _partitionWithIndex(fa, predicateWithIndex) {
    return exports.Compactable.separate(exports.FunctorWithIndex.mapWithIndex(fa, (i, a) => predicateWithIndex(i, a) ? Ei.right(a) : Ei.left(a)));
}
exports.FilterableWithIndex = Object.assign(Object.assign(Object.assign({}, exports.FunctorWithIndex), exports.Filterable), { filterWithIndex: _filterWithIndex, filterMapWithIndex: (fa, f) => exports.Compactable.compact(exports.FunctorWithIndex.mapWithIndex(fa, f)), partitionWithIndex: _partitionWithIndex, partitionMapWithIndex: (fa, f) => exports.Compactable.separate(exports.FunctorWithIndex.mapWithIndex(fa, f)) });
function filterWithIndex(predicateWithIndex) {
    return (fa) => exports.FilterableWithIndex.filterWithIndex(fa, predicateWithIndex);
}
exports.filterWithIndex = filterWithIndex;
exports.filterMapWithIndex = function_2.curry(function_1.flip(exports.FilterableWithIndex.filterMapWithIndex));
function partitionWithIndex(predicateWithIndex) {
    return (fa) => exports.FilterableWithIndex.partitionWithIndex(fa, predicateWithIndex);
}
exports.partitionWithIndex = partitionWithIndex;
exports.partitionMapWithIndex = function_2.curry(function_1.flip(exports.FilterableWithIndex.partitionMapWithIndex));
exports.range = function_1.flow($IOG.range, exports.fromIOGenerator);
exports.replicate = function_1.flow($IOG.replicate, exports.fromIOGenerator);
const fromReadonlyArray = (x) => {
    return function_1.flow($IOG.fromReadonlyArray, exports.fromIOGenerator)(x);
};
exports.fromReadonlyArray = fromReadonlyArray;
const sieve = (f) => (as) => function () {
    return __asyncGenerator(this, arguments, function* () {
        var e_5, _b;
        const init = [];
        try {
            for (var _c = __asyncValues(as()), _d; _d = yield __await(_c.next()), !_d.done;) {
                const a = _d.value;
                if (!f(init, a)) {
                    continue;
                }
                init.push(a);
                yield yield __await(a);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) yield __await(_b.call(_c));
            }
            finally { if (e_5) throw e_5.error; }
        }
    });
};
exports.sieve = sieve;
exports.prime = function_1.pipe(exports.range(2), exports.sieve((init, a) => function_1.pipe(init, RA.every((_a) => 0 !== a % _a))));
exports.exp = function_1.pipe(exports.range(0), exports.map((n) => Math.exp(n)));
const fibonacci = function () {
    return __asyncGenerator(this, arguments, function* () {
        for (let as = [1, 0]; true; as = [as[1], as[0] + as[1]]) {
            yield yield __await(as[1]);
        }
    });
};
exports.fibonacci = fibonacci;
const flatten = (as) => function () {
    return __asyncGenerator(this, arguments, function* () {
        var e_6, _b;
        try {
            for (var _c = __asyncValues(as()), _d; _d = yield __await(_c.next()), !_d.done;) {
                const a = _d.value;
                yield __await(yield* __asyncDelegator(__asyncValues(a())));
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) yield __await(_b.call(_c));
            }
            finally { if (e_6) throw e_6.error; }
        }
    });
};
exports.flatten = flatten;
const take = (n) => (as) => function () {
    return __asyncGenerator(this, arguments, function* () {
        var e_7, _b;
        try {
            for (var _c = __asyncValues(function_1.pipe(as, exports.zip(exports.range(0)))()), _d; _d = yield __await(_c.next()), !_d.done;) {
                const [a, i] = _d.value;
                if (i >= n) {
                    break;
                }
                yield yield __await(a);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) yield __await(_b.call(_c));
            }
            finally { if (e_7) throw e_7.error; }
        }
    });
};
exports.take = take;
const drop = (n) => (as) => function () {
    return __asyncGenerator(this, arguments, function* () {
        var e_8, _b;
        try {
            for (var _c = __asyncValues(function_1.pipe(as, exports.zip(exports.range(0)))()), _d; _d = yield __await(_c.next()), !_d.done;) {
                const [a, i] = _d.value;
                if (i < n) {
                    continue;
                }
                yield yield __await(a);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) yield __await(_b.call(_c));
            }
            finally { if (e_8) throw e_8.error; }
        }
    });
};
exports.drop = drop;
const zip = (bs) => (as) => function () {
    return __asyncGenerator(this, arguments, function* () {
        var e_9, _b;
        const _bs = bs();
        try {
            for (var _c = __asyncValues(as()), _d; _d = yield __await(_c.next()), !_d.done;) {
                const a = _d.value;
                const b = yield __await(_bs.next());
                if (b.done) {
                    break;
                }
                yield yield __await([a, b.value]);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) yield __await(_b.call(_c));
            }
            finally { if (e_9) throw e_9.error; }
        }
    });
};
exports.zip = zip;
const uniq = (E) => exports.sieve((init, a) => !function_1.pipe(init, RA.elem(E)(a)));
exports.uniq = uniq;
const match = (onEmpty, onNonEmpty) => (as) => function_1.pipe(as().next(), (a) => () => a.then((_a) => _a.done ? onEmpty() : onNonEmpty(_a.value, function_1.pipe(as, exports.drop(1)))));
exports.match = match;
const toTask = (as) => () => __awaiter(void 0, void 0, void 0, function* () {
    var e_10, _b;
    const _as = [];
    try {
        for (var _c = __asyncValues(as()), _d; _d = yield _c.next(), !_d.done;) {
            const a = _d.value;
            _as.push(a);
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_b = _c.return)) yield _b.call(_c);
        }
        finally { if (e_10) throw e_10.error; }
    }
    return _as;
});
exports.toTask = toTask;
exports.isEmpty = exports.match(function_1.constTrue, function_1.constFalse);
exports.isNonEmpty = function_1.flow(exports.isEmpty, T.map((a) => !a));
const lookup = (i) => (as) => i < 0
    ? T.of(O.none)
    : function_1.pipe(as, exports.drop(i), exports.match(() => O.none, (a) => O.some(a)));
exports.lookup = lookup;
const head = (as) => function_1.pipe(as, exports.lookup(0));
exports.head = head;
function find(predicate) {
    return (as) => () => __awaiter(this, void 0, void 0, function* () {
        var e_11, _b;
        try {
            for (var _c = __asyncValues(as()), _d; _d = yield _c.next(), !_d.done;) {
                const a = _d.value;
                if (predicate(a)) {
                    return O.some(a);
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) yield _b.call(_c);
            }
            finally { if (e_11) throw e_11.error; }
        }
        return O.none;
    });
}
exports.find = find;
const elem = (Eq) => (a) => find((_a) => Eq.equals(a, _a));
exports.elem = elem;
