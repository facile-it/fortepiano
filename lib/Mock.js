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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.null = exports.undefined = exports.void = exports.readonlyRecord = exports.readonlyNonEmptyArray = exports.readonlyArray = exports.union = exports.partial = exports.struct = exports.tuple = exports.nullable = exports.unknown = exports.literal = exports.string = exports.number = exports.integer = exports.float = exports.boolean = exports.MonadIO = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.fromIO = exports.FromIO = exports.Monad = exports.bind = exports.chainFirst = exports.chain = exports.Chain = exports.Applicative = exports.apS = exports.apSecond = exports.apFirst = exports.ap = exports.Apply = exports.Do = exports.of = exports.Pointed = exports.bindTo = exports.flap = exports.map = exports.Functor = exports.URI = void 0;
var _Apply = __importStar(require("fp-ts/Apply"));
var C = __importStar(require("fp-ts/Chain"));
var FIO = __importStar(require("fp-ts/FromIO"));
var function_1 = require("fp-ts/function");
var F = __importStar(require("fp-ts/Functor"));
var IO = __importStar(require("fp-ts/IO"));
var N = __importStar(require("fp-ts/number"));
var Op = __importStar(require("fp-ts/Option"));
var Or = __importStar(require("fp-ts/Ord"));
var R = __importStar(require("fp-ts/Random"));
var RA = __importStar(require("fp-ts/ReadonlyArray"));
var RNEA = __importStar(require("fp-ts/ReadonlyNonEmptyArray"));
var RR = __importStar(require("fp-ts/ReadonlyRecord"));
var Se = __importStar(require("fp-ts/Semigroup"));
var t = __importStar(require("io-ts"));
var function_2 = require("./function");
var $GL = __importStar(require("./GeneratorL"));
var $St = __importStar(require("./struct"));
var $t = __importStar(require("./Type"));
exports.URI = 'Mock';
exports.Functor = {
    URI: exports.URI,
    map: function (fa, f) { return function_1.pipe(fa(), IO.map(f), exports.FromIO.fromIO); },
};
exports.map = function_2.curry(function_1.flip(exports.Functor.map));
exports.flap = F.flap(exports.Functor);
exports.bindTo = F.bindTo(exports.Functor);
exports.Pointed = {
    URI: exports.URI,
    of: function (a) {
        return function () {
            var as = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                as[_i] = arguments[_i];
            }
            return function_1.pipe(as, RNEA.fromReadonlyArray, Op.traverse(IO.Applicative)(R.randomElem), IO.map(Op.match(function () { return a; }, function (_a) {
                return $t.struct.is(a) && $t.struct.is(_a)
                    ? function_1.pipe(_a, $St.filterDeep(function_1.not(t.undefined.is)), function (_a) {
                        return $St.patch(_a)(a);
                    })
                    : _a;
            })));
        };
    },
};
exports.of = exports.Pointed.of;
exports.Do = exports.Pointed.of({});
exports.Apply = __assign(__assign({}, exports.Functor), { ap: function (fab, fa) { return exports.Chain.chain(fab, function_2.curry(exports.Functor.map)(fa)); } });
exports.ap = function_2.curry(function_1.flip(exports.Apply.ap));
exports.apFirst = _Apply.apFirst(exports.Apply);
exports.apSecond = _Apply.apSecond(exports.Apply);
exports.apS = _Apply.apS(exports.Apply);
exports.Applicative = __assign(__assign({}, exports.Pointed), exports.Apply);
exports.Chain = __assign(__assign({}, exports.Apply), { chain: function (fa, f) { return exports.Functor.map(exports.Functor.map(fa, f), function (fb) { return fb()(); }); } });
exports.chain = function_2.curry(function_1.flip(exports.Chain.chain));
exports.chainFirst = C.chainFirst(exports.Chain);
exports.bind = C.bind(exports.Chain);
exports.Monad = __assign(__assign({}, exports.Applicative), exports.Chain);
exports.FromIO = {
    URI: exports.URI,
    fromIO: function (fa) {
        return function () {
            var as = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                as[_i] = arguments[_i];
            }
            return function_1.pipe(fa, IO.chain(function (a) { return exports.Pointed.of(a).apply(void 0, __spreadArray([], __read(as))); }));
        };
    },
};
exports.fromIO = exports.FromIO.fromIO;
exports.fromIOK = FIO.fromIOK(exports.FromIO);
exports.chainIOK = FIO.chainIOK(exports.FromIO, exports.Chain);
exports.chainFirstIOK = FIO.chainFirstIOK(exports.FromIO, exports.Chain);
exports.MonadIO = __assign(__assign({}, exports.Monad), exports.FromIO);
// eslint-disable-next-line @typescript-eslint/no-empty-function
var _void = function () { return function () { }; };
exports.void = _void;
var _undefined = function () { return function () { return undefined; }; };
exports.undefined = _undefined;
var _null = function () { return function () { return null; }; };
exports.null = _null;
exports.boolean = exports.fromIO(R.randomBool);
var float = function (min, max) {
    if (min === void 0) { min = Number.MIN_SAFE_INTEGER * 1e-6; }
    if (max === void 0) { max = Number.MAX_SAFE_INTEGER * 1e-6; }
    return function () {
        var as = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            as[_i] = arguments[_i];
        }
        return function_1.pipe(exports.fromIO(R.randomRange(min, Math.max(min + Number.EPSILON, max))).apply(void 0, __spreadArray([], __read(as))), IO.map(Or.clamp(N.Ord)(min, Math.max(min + Number.EPSILON, max - Number.EPSILON))));
    };
};
exports.float = float;
var integer = function (min, max) {
    if (min === void 0) { min = Number.MIN_SAFE_INTEGER * 1e-6; }
    if (max === void 0) { max = Number.MAX_SAFE_INTEGER * 1e-6; }
    return function () {
        var as = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            as[_i] = arguments[_i];
        }
        return function_1.pipe(exports.float(min, max).apply(void 0, __spreadArray([], __read(as))), IO.map(Math.floor));
    };
};
exports.integer = integer;
var number = function (min, max) {
    if (min === void 0) { min = Number.MIN_SAFE_INTEGER * 1e-6; }
    if (max === void 0) { max = Number.MAX_SAFE_INTEGER * 1e-6; }
    return function () {
        var as = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            as[_i] = arguments[_i];
        }
        return function_1.pipe(union(exports.float(min, max), exports.integer(min, max)).apply(void 0, __spreadArray([], __read(as))), IO.map(Or.clamp(N.Ord)(min, Math.max(min + Number.EPSILON, max - Number.EPSILON))));
    };
};
exports.number = number;
exports.string = exports.fromIO(function () { return Math.random().toString(36).split('.')[1]; });
var literal = function (a) {
    return exports.of(a);
};
exports.literal = literal;
var unknown = function (depth) {
    if (depth === void 0) { depth = 10; }
    return function_2.recurse(function (_unknown, _depth) {
        return (_depth < depth
            ? union(_undefined, _null, exports.boolean, exports.number(), exports.string, exports.readonlyArray(_unknown), exports.readonlyRecord(exports.string, _unknown))
            : union(_undefined, _null, exports.boolean, exports.number(), exports.string));
    });
};
exports.unknown = unknown;
var nullable = function (M) {
    return union(M, _undefined);
};
exports.nullable = nullable;
exports.tuple = _Apply.sequenceT(exports.Apply);
exports.struct = _Apply.sequenceS(exports.Apply);
var partial = function (Ms) {
    return function_1.pipe(Ms, RR.map(exports.nullable), exports.struct);
};
exports.partial = partial;
function union() {
    var Ms = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        Ms[_i] = arguments[_i];
    }
    return function_1.pipe(Ms, R.randomElem, IO.chain(function_2.run), exports.fromIO);
}
exports.union = union;
var readonlyArray = function (M, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 10; }
    return function_1.pipe(R.randomInt(Math.max(0, min), Math.max(0, min, max)), IO.map(function (n) { return function_1.pipe($GL.fromIO(M()), $GL.takeLeft(n), $GL.toReadonlyArray); }), exports.fromIO);
};
exports.readonlyArray = readonlyArray;
var readonlyNonEmptyArray = function (M, min, max) {
    if (min === void 0) { min = 1; }
    if (max === void 0) { max = 10; }
    return exports.readonlyArray(M, Math.max(1, min), Math.max(1, min, max));
};
exports.readonlyNonEmptyArray = readonlyNonEmptyArray;
var readonlyRecord = function (KM, TM, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 10; }
    return function_1.pipe(exports.readonlyArray(exports.tuple(KM, TM), Math.max(0, min), Math.max(0, min, max))(), IO.map(RR.fromFoldable(Se.last(), RA.Foldable)), exports.fromIO);
};
exports.readonlyRecord = readonlyRecord;
