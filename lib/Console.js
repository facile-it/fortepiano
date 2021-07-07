"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeLog = exports.timeEnd = exports.time = exports.table = exports.groupEnd = exports.groupCollapsed = exports.group = exports.countReset = exports.count = exports.assert = exports.warn = exports.trace = exports.log = exports.info = exports.error = void 0;
const _noArgs = (method) => () => console[method]();
const _singleArg = (method) => (a) => () => console[method](a);
const _multipleArgs = (method) => (...as) => () => console[method](...as);
exports.error = _multipleArgs('error');
exports.info = _multipleArgs('info');
exports.log = _multipleArgs('log');
exports.trace = _multipleArgs('trace');
exports.warn = _multipleArgs('warn');
const assert = (condition, ...as) => () => console.assert(condition, ...as);
exports.assert = assert;
exports.count = _singleArg('count');
exports.countReset = _singleArg('countReset');
exports.group = _multipleArgs('group');
exports.groupCollapsed = _multipleArgs('groupCollapsed');
exports.groupEnd = _noArgs('groupEnd');
function table(...args) {
    return () => console.table(...args);
}
exports.table = table;
exports.time = _singleArg('time');
exports.timeEnd = _singleArg('timeEnd');
exports.timeLog = _singleArg('timeLog');
