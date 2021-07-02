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
exports.lax = exports.literalUnion = exports.alias = exports.nullable = exports.struct = exports.literal = void 0;
const E = __importStar(require("fp-ts/Either"));
const function_1 = require("fp-ts/function");
const O = __importStar(require("fp-ts/Option"));
const RA = __importStar(require("fp-ts/ReadonlyArray"));
const RR = __importStar(require("fp-ts/ReadonlyRecord"));
const t = __importStar(require("io-ts"));
const isLiteral = (r) => (u) => t.string.is(u) && r.test(u);
function literal(a, name) {
    return a instanceof RegExp
        ? new t.Type(name || 'Literal', isLiteral(a), (u, c) => (isLiteral(a)(u) ? t.success(u) : t.failure(u, c)), function_1.identity)
        : t.literal(a, name);
}
exports.literal = literal;
const isStruct = (u) => 'object' === typeof u && null !== u && !Array.isArray(u);
exports.struct = new t.Type('struct', isStruct, (u, c) => (isStruct(u) ? t.success(u) : t.failure(u, c)), function_1.identity);
const nullable = (codec, name) => t.union([codec, t.undefined], name);
exports.nullable = nullable;
const alias = (name, { is, decode, encode }) => new t.Type(name, is, decode, encode);
exports.alias = alias;
const isStringArray = (as) => t.string.is(as[0]);
function literalUnion(as, name) {
    return isStringArray(as)
        ? t.keyof(as.reduce((result, string) => (Object.assign(Object.assign({}, result), { [string]: null })), {}), name)
        : t.union(as.map((number) => t.literal(number)), name);
}
exports.literalUnion = literalUnion;
const lax = (props, name) => function_1.pipe(t.partial(props, name), (partial) => new t.Type(partial.name, partial.is, function_1.flow(t.UnknownRecord.validate, E.map(RR.toReadonlyArray), E.map(RA.reduce({}, (result, [key, value]) => function_1.pipe(partial.props, RR.lookup(key), O.match(() => (Object.assign(Object.assign({}, result), { [key]: value })), (codec) => function_1.pipe(codec.decode(value), E.match(() => result, (value) => (Object.assign(Object.assign({}, result), { [key]: value })))))))), E.chain(t.success)), partial.encode));
exports.lax = lax;
