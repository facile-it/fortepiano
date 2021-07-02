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
exports.filterWithIndex = exports.FilterableWithIndex = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = exports.Filterable = exports.separate = exports.compact = exports.Compactable = exports.duplicate = exports.extend = exports.Extend = exports.zero = exports.Alternative = exports.alt = exports.Alt = exports.unfold = exports.Unfoldable = exports.MonadIO = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.fromIO = exports.FromIO = exports.Monad = exports.chainWithIndex = exports.bind = exports.chainFirst = exports.chain = exports.Chain = exports.Applicative = exports.apS = exports.apSecond = exports.apFirst = exports.ap = exports.Apply = exports.mapWithIndex = exports.FunctorWithIndex = exports.Do = exports.of = exports.Pointed = exports.bindTo = exports.flap = exports.map = exports.Functor = exports.getOrd = exports.getEq = exports.getMonoid = exports.URI = void 0;
exports.zip = exports.zipWith = exports.reverse = exports.sortBy = exports.sort = exports.uniq = exports.sieve = exports.scanRight = exports.scanLeft = exports.dropLeftWhile = exports.dropRight = exports.dropLeft = exports.takeLeftWhile = exports.takeRight = exports.takeLeft = exports.append = exports.prepend = exports.flatten = exports.fibonacci = exports.exp = exports.prime = exports.randomElem = exports.randomBool = exports.randomRange = exports.randomInt = exports.random = exports.fromReadonlyRecord = exports.fromReadonlyArray = exports.replicate = exports.range = exports.makeBy = exports.wither = exports.wilt = exports.Witherable = exports.traverseWithIndex = exports.TraversableWithIndex = exports.traverse = exports.Traversable = exports.sequence = exports.reduceRightWithIndex = exports.foldMapWithIndex = exports.reduceWithIndex = exports.FoldableWithIndex = exports.reduceRight = exports.foldMap = exports.reduce = exports.Foldable = exports.partitionMapWithIndex = exports.partitionWithIndex = exports.filterMapWithIndex = void 0;
exports.deleteAt = exports.updateAt = exports.modifyAt = exports.insertAt = exports.elem = exports.findLastIndex = exports.findLastMap = exports.findLast = exports.findFirstIndex = exports.findFirstMap = exports.findFirst = exports.isOutOfBound = exports.size = exports.isNonEmpty = exports.isEmpty = exports.unzip = exports.splitAt = exports.spanLeft = exports.init = exports.tail = exports.last = exports.head = exports.lookup = exports.toReadonlyArray = exports.matchRight = exports.matchLeft = exports.chunksOf = exports.chop = exports.rotate = exports.intersperse = exports.prependAll = exports.lefts = exports.rights = void 0;
const _Apply = __importStar(require("fp-ts/Apply"));
const Ch = __importStar(require("fp-ts/Chain"));
const Ei = __importStar(require("fp-ts/Either"));
const Eq = __importStar(require("fp-ts/Eq"));
const FIO = __importStar(require("fp-ts/FromIO"));
const function_1 = require("fp-ts/function");
const Fu = __importStar(require("fp-ts/Functor"));
const Op = __importStar(require("fp-ts/Option"));
const Or = __importStar(require("fp-ts/Ord"));
const R = __importStar(require("fp-ts/Random"));
const RA = __importStar(require("fp-ts/ReadonlyArray"));
const RR = __importStar(require("fp-ts/ReadonlyRecord"));
const S = __importStar(require("fp-ts/Separated"));
const function_2 = require("./function");
exports.URI = 'GeneratorL';
const getMonoid = () => ({
    empty: exports.fromReadonlyArray([]),
    concat: (x, y) => function* () {
        yield* x();
        yield* y();
    },
});
exports.getMonoid = getMonoid;
const getEq = (E) => Eq.fromEquals((x, y) => {
    const bs = y();
    for (const a of x()) {
        const b = bs.next();
        if (b.done || !E.equals(a, b.value)) {
            return false;
        }
    }
    return Boolean(bs.next().done);
});
exports.getEq = getEq;
const getOrd = (O) => Or.fromCompare((first, second) => {
    const bs = second();
    for (const a of first()) {
        const b = bs.next();
        if (b.done) {
            return 1;
        }
        const ordering = O.compare(a, b.value);
        if (0 !== ordering) {
            return ordering;
        }
    }
    return !bs.next().done ? -1 : 0;
});
exports.getOrd = getOrd;
exports.Functor = {
    URI: exports.URI,
    map: (fa, f) => function* () {
        for (const a of fa()) {
            yield f(a);
        }
    },
};
exports.map = function_2.curry(function_1.flip(exports.Functor.map));
exports.flap = Fu.flap(exports.Functor);
exports.bindTo = Fu.bindTo(exports.Functor);
exports.Pointed = {
    URI: exports.URI,
    of: (a) => function* () {
        yield a;
    },
};
exports.of = exports.Pointed.of;
exports.Do = exports.Pointed.of({});
exports.FunctorWithIndex = Object.assign(Object.assign({}, exports.Functor), { mapWithIndex: (fa, f) => exports.Functor.map(function_1.pipe(fa, exports.zip(exports.range(0))), ([a, i]) => f(i, a)) });
exports.mapWithIndex = function_2.curry(function_1.flip(exports.FunctorWithIndex.mapWithIndex));
exports.Apply = Object.assign(Object.assign({}, exports.Functor), { ap: (fab, fa) => exports.Chain.chain(fab, function_2.curry(exports.Functor.map)(fa)) });
exports.ap = function_2.curry(function_1.flip(exports.Apply.ap));
exports.apFirst = _Apply.apFirst(exports.Apply);
exports.apSecond = _Apply.apSecond(exports.Apply);
exports.apS = _Apply.apS(exports.Apply);
exports.Applicative = Object.assign(Object.assign({}, exports.Pointed), exports.Apply);
exports.Chain = Object.assign(Object.assign({}, exports.Apply), { chain: (fa, f) => exports.flatten(exports.Functor.map(fa, f)) });
exports.chain = function_2.curry(function_1.flip(exports.Chain.chain));
exports.chainFirst = Ch.chainFirst(exports.Chain);
exports.bind = Ch.bind(exports.Chain);
const chainWithIndex = (f) => (fa) => function_1.pipe(fa, exports.zip(exports.range(0)), exports.chain(([a, i]) => f(i, a)));
exports.chainWithIndex = chainWithIndex;
exports.Monad = Object.assign(Object.assign({}, exports.Applicative), exports.Chain);
exports.FromIO = {
    URI: exports.URI,
    fromIO: (fa) => function_1.pipe(exports.range(0), exports.map(fa)),
};
exports.fromIO = exports.FromIO.fromIO;
exports.fromIOK = FIO.fromIOK(exports.FromIO);
exports.chainIOK = FIO.chainIOK(exports.FromIO, exports.Chain);
exports.chainFirstIOK = FIO.chainFirstIOK(exports.FromIO, exports.Chain);
exports.MonadIO = Object.assign(Object.assign({}, exports.Monad), exports.FromIO);
exports.Unfoldable = {
    URI: exports.URI,
    unfold: (b, f) => function* () {
        for (let _b = b, ab = f(_b); Op.isSome(ab); _b = ab.value[1], ab = f(_b)) {
            yield ab.value[0];
        }
    },
};
exports.unfold = function_2.curry(function_1.flip(exports.Unfoldable.unfold));
exports.Alt = Object.assign(Object.assign({}, exports.Functor), { alt: (fa, that) => exports.getMonoid().concat(fa, that()) });
exports.alt = function_2.curry(function_1.flip(exports.Alt.alt));
exports.Alternative = Object.assign(Object.assign(Object.assign({}, exports.Applicative), exports.Alt), { zero: () => exports.getMonoid().empty });
exports.zero = exports.Alternative.zero;
exports.Extend = Object.assign(Object.assign({}, exports.Functor), { extend: (wa, f) => function_1.pipe(wa, exports.mapWithIndex((i) => function_1.pipe(wa, exports.dropLeft(i), f))) });
exports.extend = function_2.curry(function_1.flip(exports.Extend.extend));
const duplicate = (fa) => function_1.pipe(fa, exports.extend(function_1.identity));
exports.duplicate = duplicate;
exports.Compactable = {
    URI: exports.URI,
    compact: (fa) => exports.Functor.map(exports.Filterable.filter(fa, Op.isSome), (a) => a.value),
    separate: (fa) => S.separated(exports.Functor.map(exports.Filterable.filter(fa, Ei.isLeft), (a) => a.left), exports.Functor.map(exports.Filterable.filter(fa, Ei.isRight), (a) => a.right)),
};
exports.compact = exports.Compactable.compact;
exports.separate = exports.Compactable.separate;
function _filter(fa, predicate) {
    return function* () {
        for (const a of fa()) {
            if (!predicate(a)) {
                continue;
            }
            yield a;
        }
    };
}
function _partition(fa, predicate) {
    return S.separated(exports.Filterable.filter(fa, function_1.not(predicate)), exports.Filterable.filter(fa, predicate));
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
    return exports.Compactable.compact(exports.FunctorWithIndex.mapWithIndex(fa, (i, a) => predicateWithIndex(i, a) ? Op.some(a) : Op.none));
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
exports.Foldable = {
    URI: exports.URI,
    reduce: (fa, b, f) => exports.FoldableWithIndex.reduceWithIndex(fa, b, (_, _b, a) => f(_b, a)),
    foldMap: (M) => (fa, f) => exports.FoldableWithIndex.foldMapWithIndex(M)(fa, (_, a) => f(a)),
    reduceRight: (fa, b, f) => exports.FoldableWithIndex.reduceRightWithIndex(fa, b, (_, a, _b) => f(a, _b)),
};
const reduce = (b, f) => (fa) => exports.Foldable.reduce(fa, b, f);
exports.reduce = reduce;
const foldMap = (M) => (f) => (fa) => exports.Foldable.foldMap(M)(fa, f);
exports.foldMap = foldMap;
const reduceRight = (b, f) => (fa) => exports.Foldable.reduceRight(fa, b, f);
exports.reduceRight = reduceRight;
exports.FoldableWithIndex = Object.assign(Object.assign({}, exports.Foldable), { reduceWithIndex: (fa, b, f) => function_1.pipe(fa, exports.zip(exports.range(0)), (_fa) => {
        let _b = b;
        for (const [a, i] of _fa()) {
            _b = f(i, _b, a);
        }
        return _b;
    }), foldMapWithIndex: (M) => (fa, f) => exports.FoldableWithIndex.reduceWithIndex(fa, M.empty, (i, b, a) => M.concat(b, f(i, a))), reduceRightWithIndex: (fa, b, f) => function_1.pipe(fa, exports.toReadonlyArray, RA.reduceRightWithIndex(b, f)) });
const reduceWithIndex = (b, f) => (fa) => exports.FoldableWithIndex.reduceWithIndex(fa, b, f);
exports.reduceWithIndex = reduceWithIndex;
const foldMapWithIndex = (M) => (f) => (fa) => exports.FoldableWithIndex.foldMapWithIndex(M)(fa, f);
exports.foldMapWithIndex = foldMapWithIndex;
const reduceRightWithIndex = (b, f) => (fa) => exports.FoldableWithIndex.reduceRightWithIndex(fa, b, f);
exports.reduceRightWithIndex = reduceRightWithIndex;
function _traverse(F) {
    return (ta, f) => exports.TraversableWithIndex.traverseWithIndex(F)(ta, (_, a) => f(a));
}
function sequence(F) {
    return (ta) => exports.Traversable.traverse(F)(ta, function_1.identity);
}
exports.sequence = sequence;
exports.Traversable = Object.assign(Object.assign(Object.assign({}, exports.Functor), exports.Foldable), { traverse: _traverse, sequence });
function traverse(F) {
    return (f) => (ta) => exports.Traversable.traverse(F)(ta, f);
}
exports.traverse = traverse;
function _traverseWithIndex(F) {
    return (ta, f) => exports.FoldableWithIndex.reduceWithIndex(ta, F.of(exports.zero()), (i, fbs, a) => F.ap(F.map(fbs, (bs) => (b) => function_1.pipe(bs, exports.append(b))), f(i, a)));
}
exports.TraversableWithIndex = Object.assign(Object.assign(Object.assign(Object.assign({}, exports.FunctorWithIndex), exports.FoldableWithIndex), exports.Traversable), { traverseWithIndex: _traverseWithIndex });
function traverseWithIndex(F) {
    return (f) => (ta) => exports.TraversableWithIndex.traverseWithIndex(F)(ta, f);
}
exports.traverseWithIndex = traverseWithIndex;
function _wilt(F) {
    return (wa, f) => F.map(exports.Traversable.traverse(F)(wa, f), exports.separate);
}
function _wither(F) {
    return (ta, f) => F.map(exports.Traversable.traverse(F)(ta, f), exports.compact);
}
exports.Witherable = Object.assign(Object.assign(Object.assign({}, exports.Traversable), exports.Filterable), { wilt: _wilt, wither: _wither });
function wilt(F) {
    return (f) => (wa) => exports.Witherable.wilt(F)(wa, f);
}
exports.wilt = wilt;
function wither(F) {
    return (f) => (ta) => exports.Witherable.wither(F)(ta, f);
}
exports.wither = wither;
const makeBy = (f) => function* () {
    for (let i = 0; true; i++) {
        yield f(i);
    }
};
exports.makeBy = makeBy;
const range = (start, end = Infinity) => function_1.pipe(exports.makeBy((i) => start + i), takeLeftWhile((n) => n <= Math.max(start, end)));
exports.range = range;
const replicate = (a) => exports.makeBy(() => a);
exports.replicate = replicate;
const fromReadonlyArray = (as) => function* () {
    yield* as;
};
exports.fromReadonlyArray = fromReadonlyArray;
exports.fromReadonlyRecord = RR.toUnfoldable(exports.Unfoldable);
exports.random = exports.fromIO(R.random);
const randomInt = (low, high) => exports.fromIO(R.randomInt(Math.floor(low), Math.max(Math.floor(low), Math.floor(high))));
exports.randomInt = randomInt;
const randomRange = (min, max) => exports.fromIO(R.randomRange(min, Math.max(min, max)));
exports.randomRange = randomRange;
exports.randomBool = exports.fromIO(R.randomBool);
const randomElem = (as) => exports.fromIO(R.randomElem(as));
exports.randomElem = randomElem;
exports.prime = function_1.pipe(exports.range(2), sieve((init, n) => function_1.pipe(init, RA.every((_n) => 0 !== n % _n))));
exports.exp = exports.makeBy((n) => Math.exp(n));
const fibonacci = function* () {
    for (let ns = [1, 0]; true; ns = [ns[1], ns[0] + ns[1]]) {
        yield ns[1];
    }
};
exports.fibonacci = fibonacci;
const flatten = (mma) => function* () {
    for (const ma of mma()) {
        yield* ma();
    }
};
exports.flatten = flatten;
const prepend = (a) => (ma) => function* () {
    yield a;
    yield* ma();
};
exports.prepend = prepend;
const append = (a) => (ma) => function* () {
    yield* ma();
    yield a;
};
exports.append = append;
const takeLeft = (n) => (ma) => function* () {
    for (const [a, i] of function_1.pipe(ma, exports.zip(exports.range(0)))()) {
        if (i >= n) {
            break;
        }
        yield a;
    }
};
exports.takeLeft = takeLeft;
const takeRight = (n) => (ma) => function_1.pipe(ma, exports.toReadonlyArray, RA.takeRight(n), exports.fromReadonlyArray);
exports.takeRight = takeRight;
function takeLeftWhile(predicate) {
    return (ma) => function* () {
        for (const a of ma()) {
            if (!predicate(a)) {
                break;
            }
            yield a;
        }
    };
}
exports.takeLeftWhile = takeLeftWhile;
const dropLeft = (n) => (ma) => function* () {
    for (const [a, i] of function_1.pipe(ma, exports.zip(exports.range(0)))()) {
        if (i < n) {
            continue;
        }
        yield a;
    }
};
exports.dropLeft = dropLeft;
const dropRight = (n) => (ma) => function_1.pipe(ma, exports.toReadonlyArray, RA.dropRight(n), exports.fromReadonlyArray);
exports.dropRight = dropRight;
function dropLeftWhile(predicate) {
    return (ma) => function* () {
        const as = ma();
        let a = as.next();
        while (!a.done && predicate(a.value)) {
            a = as.next();
        }
        if (!a.done) {
            yield a.value;
        }
        yield* as;
    };
}
exports.dropLeftWhile = dropLeftWhile;
const scanLeft = (b, f) => (ma) => function* () {
    yield b;
    let _b = b;
    for (const a of ma()) {
        _b = f(_b, a);
        yield _b;
    }
};
exports.scanLeft = scanLeft;
const scanRight = (b, f) => (ma) => function_1.pipe(ma, exports.scanLeft(b, (b, a) => f(a, b)), exports.reverse);
exports.scanRight = scanRight;
function sieve(f) {
    return (ma) => function* () {
        const init = [];
        for (const a of ma()) {
            if (!f(init, a)) {
                continue;
            }
            init.push(a);
            yield a;
        }
    };
}
exports.sieve = sieve;
const uniq = (E) => sieve((init, a) => !function_1.pipe(init, RA.elem(E)(a)));
exports.uniq = uniq;
const sort = (O) => exports.sortBy([O]);
exports.sort = sort;
const sortBy = (Os) => (ma) => function_1.pipe(ma, exports.toReadonlyArray, RA.sortBy(Os), exports.fromReadonlyArray);
exports.sortBy = sortBy;
const reverse = (ma) => function* () {
    const as = exports.toReadonlyArray(ma);
    for (let i = as.length - 1; i >= 0; i--) {
        yield as[i];
    }
};
exports.reverse = reverse;
const zipWith = (mb, f) => (ma) => function* () {
    const bs = mb();
    for (const a of ma()) {
        const b = bs.next();
        if (b.done) {
            break;
        }
        yield f(a, b.value);
    }
};
exports.zipWith = zipWith;
const zip = (mb) => (ma) => function_1.pipe(ma, exports.zipWith(mb, (a, b) => [a, b]));
exports.zip = zip;
const rights = (ma) => function_1.pipe(ma, exports.filterMap(Op.fromEither));
exports.rights = rights;
const lefts = (ma) => function_1.pipe(ma, filter(Ei.isLeft), exports.map((e) => e.left));
exports.lefts = lefts;
const prependAll = (middle) => (ma) => function_1.pipe(ma, exports.matchLeft(() => ma, () => function* () {
    for (const a of ma()) {
        yield middle;
        yield a;
    }
}));
exports.prependAll = prependAll;
const intersperse = (middle) => function_1.flow(exports.prependAll(middle), exports.dropLeft(1));
exports.intersperse = intersperse;
const rotate = (n) => (ma) => function_1.pipe(ma, exports.toReadonlyArray, RA.rotate(n), exports.fromReadonlyArray);
exports.rotate = rotate;
const chop = (f) => (ma) => function* () {
    for (let _isNonEmpty = exports.isNonEmpty(ma), [b, _ma] = f(ma); _isNonEmpty; _isNonEmpty = exports.isNonEmpty(_ma), [b, _ma] = f(_ma)) {
        yield b;
    }
};
exports.chop = chop;
const chunksOf = (n) => (ma) => function_1.pipe(ma, exports.chop(exports.splitAt(Math.max(1, n))));
exports.chunksOf = chunksOf;
const matchLeft = (onEmpty, onNonEmpty) => (ma) => function_1.pipe(ma().next(), (a) => a.done ? onEmpty() : onNonEmpty(a.value, function_1.pipe(ma, exports.dropLeft(1))));
exports.matchLeft = matchLeft;
const matchRight = (onEmpty, onNonEmpty) => (ma) => function_1.pipe(ma, exports.zip(exports.range(0)), exports.last, Op.match(onEmpty, ([a, i]) => onNonEmpty(function_1.pipe(ma, filterWithIndex((_i) => i !== _i)), a)));
exports.matchRight = matchRight;
const toReadonlyArray = (ma) => [
    ...ma(),
];
exports.toReadonlyArray = toReadonlyArray;
const lookup = (i) => (ma) => i < 0
    ? Op.none
    : function_1.pipe(ma, exports.dropLeft(i), exports.matchLeft(() => Op.none, Op.some));
exports.lookup = lookup;
exports.head = exports.lookup(0);
const last = (ma) => {
    let last = Op.none;
    for (const a of ma()) {
        last = Op.some(a);
    }
    return last;
};
exports.last = last;
const tail = (ma) => function_1.pipe(ma, exports.matchLeft(() => Op.none, (_, tail) => Op.some(tail)));
exports.tail = tail;
const init = (ma) => function_1.pipe(ma, exports.matchRight(() => Op.none, Op.some));
exports.init = init;
function spanLeft(predicate) {
    return (ma) => {
        const i = function_1.pipe(ma, exports.findFirstIndex(function_1.not(predicate)), Op.getOrElse(() => Infinity));
        const [init, rest] = function_1.pipe(ma, exports.splitAt(i));
        return { init, rest };
    };
}
exports.spanLeft = spanLeft;
const splitAt = (n) => (ma) => [function_1.pipe(ma, exports.takeLeft(n)), function_1.pipe(ma, exports.dropLeft(n))];
exports.splitAt = splitAt;
const unzip = (mab) => [
    function_1.pipe(mab, exports.map(([a]) => a)),
    function_1.pipe(mab, exports.map(([_, b]) => b)),
];
exports.unzip = unzip;
exports.isEmpty = exports.matchLeft(function_1.constTrue, function_1.constFalse);
exports.isNonEmpty = function_1.not(exports.isEmpty);
exports.size = function_1.flow(exports.mapWithIndex(function_1.identity), exports.last, Op.match(() => 0, (i) => 1 + i));
const isOutOfBound = (n) => (ma) => n >= 0 && n < exports.size(ma);
exports.isOutOfBound = isOutOfBound;
function findFirst(predicate) {
    return (ma) => {
        for (const a of ma()) {
            if (predicate(a)) {
                return Op.some(a);
            }
        }
        return Op.none;
    };
}
exports.findFirst = findFirst;
const findFirstMap = (f) => (ma) => {
    for (const a of ma()) {
        const b = f(a);
        if (Op.isSome(b)) {
            return b;
        }
    }
    return Op.none;
};
exports.findFirstMap = findFirstMap;
const findFirstIndex = (predicate) => (ma) => function_1.pipe(ma, exports.zip(exports.range(0)), findFirst(([a]) => predicate(a)), Op.map(([_, i]) => i));
exports.findFirstIndex = findFirstIndex;
function findLast(predicate) {
    return (ma) => function_1.pipe(ma, exports.reverse, findFirst(predicate));
}
exports.findLast = findLast;
const findLastMap = (f) => (ma) => function_1.pipe(ma, exports.reverse, exports.findFirstMap(f));
exports.findLastMap = findLastMap;
const findLastIndex = (predicate) => (ma) => function_1.pipe(ma, exports.zip(exports.range(0)), exports.findLastMap(([a, i]) => (predicate(a) ? Op.some(i) : Op.none)));
exports.findLastIndex = findLastIndex;
const elem = (Eq) => (a) => findFirst((_a) => Eq.equals(a, _a));
exports.elem = elem;
const insertAt = (i, a) => (ma) => function_1.pipe(ma, exports.lookup(i), Op.map(() => function* () {
    for (const [_a, _i] of function_1.pipe(ma, exports.zip(exports.range(0)))()) {
        if (i === _i) {
            yield a;
        }
        yield _a;
    }
}));
exports.insertAt = insertAt;
const modifyAt = (i, f) => (ma) => function_1.pipe(ma, exports.lookup(i), Op.map(() => function_1.pipe(ma, exports.mapWithIndex((_i, a) => (i === _i ? f(a) : a)))));
exports.modifyAt = modifyAt;
const updateAt = (i, a) => exports.modifyAt(i, () => a);
exports.updateAt = updateAt;
const deleteAt = (i) => (ma) => function_1.pipe(ma, exports.lookup(i), Op.map(() => function_1.pipe(ma, filterWithIndex((_i) => i !== _i))));
exports.deleteAt = deleteAt;
