"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.info = exports.error = exports.warn = exports.log = void 0;
const _console = (method) => (...as) => () => console[method](...as);
exports.log = _console('log');
exports.warn = _console('warn');
exports.error = _console('error');
exports.info = _console('info');
