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
exports.null = exports.undefined = exports.void = exports.readonlyRecord = exports.readonlyNonEmptyArray = exports.readonlyArray = exports.union = exports.partial = exports.struct = exports.tuple = exports.nullable = exports.unknown = exports.literal = exports.string = exports.number = exports.integer = exports.float = exports.boolean = exports.MonadIO = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.fromIO = exports.FromIO = exports.Monad = exports.bind = exports.chainFirst = exports.chain = exports.Chain = exports.Applicative = exports.apS = exports.apSecond = exports.apFirst = exports.ap = exports.Apply = exports.Do = exports.of = exports.Pointed = exports.bindTo = exports.flap = exports.map = exports.Functor = exports.URI = void 0;
const _Apply = __importStar(require("fp-ts/Apply"));
const C = __importStar(require("fp-ts/Chain"));
const FIO = __importStar(require("fp-ts/FromIO"));
const function_1 = require("fp-ts/function");
const F = __importStar(require("fp-ts/Functor"));
const IO = __importStar(require("fp-ts/IO"));
const N = __importStar(require("fp-ts/number"));
const Op = __importStar(require("fp-ts/Option"));
const Or = __importStar(require("fp-ts/Ord"));
const R = __importStar(require("fp-ts/Random"));
const RA = __importStar(require("fp-ts/ReadonlyArray"));
const RNEA = __importStar(require("fp-ts/ReadonlyNonEmptyArray"));
const RR = __importStar(require("fp-ts/ReadonlyRecord"));
const Se = __importStar(require("fp-ts/Semigroup"));
const t = __importStar(require("io-ts"));
const function_2 = require("./function");
const $GL = __importStar(require("./GeneratorL"));
const $St = __importStar(require("./struct"));
const $t = __importStar(require("./Type"));
exports.URI = 'Mock';
exports.Functor = {
    URI: exports.URI,
    map: (fa, f) => function_1.pipe(fa(), IO.map(f), exports.FromIO.fromIO),
};
exports.map = function_2.curry(function_1.flip(exports.Functor.map));
exports.flap = F.flap(exports.Functor);
exports.bindTo = F.bindTo(exports.Functor);
exports.Pointed = {
    URI: exports.URI,
    of: (a) => (...as) => function_1.pipe(as, RNEA.fromReadonlyArray, Op.traverse(IO.Applicative)(R.randomElem), IO.map(Op.match(() => a, (_a) => $t.struct.is(a) && $t.struct.is(_a)
        ? function_1.pipe(_a, $St.filterDeep(function_1.not(t.undefined.is)), (_a) => $St.patch(_a)(a))
        : _a))),
};
exports.of = exports.Pointed.of;
exports.Do = exports.Pointed.of({});
exports.Apply = Object.assign(Object.assign({}, exports.Functor), { ap: (fab, fa) => exports.Chain.chain(fab, function_2.curry(exports.Functor.map)(fa)) });
exports.ap = function_2.curry(function_1.flip(exports.Apply.ap));
exports.apFirst = _Apply.apFirst(exports.Apply);
exports.apSecond = _Apply.apSecond(exports.Apply);
exports.apS = _Apply.apS(exports.Apply);
exports.Applicative = Object.assign(Object.assign({}, exports.Pointed), exports.Apply);
exports.Chain = Object.assign(Object.assign({}, exports.Apply), { chain: (fa, f) => exports.Functor.map(exports.Functor.map(fa, f), (fb) => fb()()) });
exports.chain = function_2.curry(function_1.flip(exports.Chain.chain));
exports.chainFirst = C.chainFirst(exports.Chain);
exports.bind = C.bind(exports.Chain);
exports.Monad = Object.assign(Object.assign({}, exports.Applicative), exports.Chain);
exports.FromIO = {
    URI: exports.URI,
    fromIO: (fa) => (...as) => function_1.pipe(fa, IO.chain((a) => exports.Pointed.of(a)(...as))),
};
exports.fromIO = exports.FromIO.fromIO;
exports.fromIOK = FIO.fromIOK(exports.FromIO);
exports.chainIOK = FIO.chainIOK(exports.FromIO, exports.Chain);
exports.chainFirstIOK = FIO.chainFirstIOK(exports.FromIO, exports.Chain);
exports.MonadIO = Object.assign(Object.assign({}, exports.Monad), exports.FromIO);
// eslint-disable-next-line @typescript-eslint/no-empty-function
const _void = () => () => { };
exports.void = _void;
const _undefined = () => () => undefined;
exports.undefined = _undefined;
const _null = () => () => null;
exports.null = _null;
exports.boolean = exports.fromIO(R.randomBool);
const float = (min = Number.MIN_SAFE_INTEGER * 1e-6, max = Number.MAX_SAFE_INTEGER * 1e-6) => (...as) => function_1.pipe(exports.fromIO(R.randomRange(min, Math.max(min + Number.EPSILON, max)))(...as), IO.map(Or.clamp(N.Ord)(min, Math.max(min + Number.EPSILON, max - Number.EPSILON))));
exports.float = float;
const integer = (min = Number.MIN_SAFE_INTEGER * 1e-6, max = Number.MAX_SAFE_INTEGER * 1e-6) => (...as) => function_1.pipe(exports.float(min, max)(...as), IO.map(Math.floor));
exports.integer = integer;
const number = (min = Number.MIN_SAFE_INTEGER * 1e-6, max = Number.MAX_SAFE_INTEGER * 1e-6) => (...as) => function_1.pipe(union(exports.float(min, max), exports.integer(min, max))(...as), IO.map(Or.clamp(N.Ord)(min, Math.max(min + Number.EPSILON, max - Number.EPSILON))));
exports.number = number;
exports.string = exports.fromIO(() => Math.random().toString(36).split('.')[1]);
const literal = (a) => exports.of(a);
exports.literal = literal;
const unknown = (depth = 10) => function_2.recurse((_unknown, _depth) => (_depth < depth
    ? union(_undefined, _null, exports.boolean, exports.number(), exports.string, exports.readonlyArray(_unknown), exports.readonlyRecord(exports.string, _unknown))
    : union(_undefined, _null, exports.boolean, exports.number(), exports.string)));
exports.unknown = unknown;
const nullable = (M) => union(M, _undefined);
exports.nullable = nullable;
exports.tuple = _Apply.sequenceT(exports.Apply);
exports.struct = _Apply.sequenceS(exports.Apply);
const partial = (Ms) => function_1.pipe(Ms, RR.map(exports.nullable), exports.struct);
exports.partial = partial;
function union(...Ms) {
    return function_1.pipe(Ms, R.randomElem, IO.chain(function_2.run), exports.fromIO);
}
exports.union = union;
const readonlyArray = (M, min = 0, max = 10) => function_1.pipe(R.randomInt(Math.max(0, min), Math.max(0, min, max)), IO.map((n) => function_1.pipe($GL.fromIO(M()), $GL.takeLeft(n), $GL.toReadonlyArray)), exports.fromIO);
exports.readonlyArray = readonlyArray;
const readonlyNonEmptyArray = (M, min = 1, max = 10) => exports.readonlyArray(M, Math.max(1, min), Math.max(1, min, max));
exports.readonlyNonEmptyArray = readonlyNonEmptyArray;
const readonlyRecord = (KM, TM, min = 0, max = 10) => function_1.pipe(exports.readonlyArray(exports.tuple(KM, TM), Math.max(0, min), Math.max(0, min, max))(), IO.map(RR.fromFoldable(Se.last(), RA.Foldable)), exports.fromIO);
exports.readonlyRecord = readonlyRecord;
