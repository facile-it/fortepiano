"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salt = void 0;
function salt(M) {
    return (seed, f) => M.chain(M.fromIO(seed), f);
}
exports.salt = salt;
