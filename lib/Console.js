"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeLog = exports.timeEnd = exports.time = exports.table = exports.groupEnd = exports.groupCollapsed = exports.group = exports.countReset = exports.count = exports.assert = exports.warn = exports.trace = exports.log = exports.info = exports.error = void 0;
const _noArgs = (method) => () => console[method]();
const _stringArg = (method) => (s) => () => console[method](s);
const _unknownArgs = (method) => (...as) => () => console[method](...as);
exports.error = _unknownArgs('error');
exports.info = _unknownArgs('info');
exports.log = _unknownArgs('log');
exports.trace = _unknownArgs('trace');
exports.warn = _unknownArgs('warn');
const assert = (condition, ...as) => () => console.assert(condition, ...as);
exports.assert = assert;
exports.count = _stringArg('count');
exports.countReset = _stringArg('countReset');
exports.group = _unknownArgs('group');
exports.groupCollapsed = _unknownArgs('groupCollapsed');
exports.groupEnd = _noArgs('groupEnd');
function table(...args) {
    return () => console.table(...args);
}
exports.table = table;
exports.time = _stringArg('time');
exports.timeEnd = _stringArg('timeEnd');
exports.timeLog = _stringArg('timeLog');
