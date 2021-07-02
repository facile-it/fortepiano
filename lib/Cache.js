"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.memory = void 0;
const Memory_1 = require("./cache/Memory");
Object.defineProperty(exports, "memory", { enumerable: true, get: function () { return Memory_1.memory; } });
const Storage_1 = require("./cache/Storage");
Object.defineProperty(exports, "storage", { enumerable: true, get: function () { return Storage_1.storage; } });
