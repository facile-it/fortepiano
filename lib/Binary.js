"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonoidXor = exports.MonoidOr = exports.MonoidAnd = void 0;
exports.MonoidAnd = {
    empty: 1,
    concat: (x, y) => Number(Boolean(x) && Boolean(y)),
};
exports.MonoidOr = {
    empty: 0,
    concat: (x, y) => Number(Boolean(x) || Boolean(y)),
};
exports.MonoidXor = {
    empty: 0,
    concat: (x, y) => Number(x ? !y : Boolean(y)),
};
