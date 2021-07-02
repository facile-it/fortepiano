"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonoidOr = void 0;
exports.MonoidOr = {
    empty: 0,
    concat: (x, y) => Number(Boolean(x) || Boolean(y)),
};
