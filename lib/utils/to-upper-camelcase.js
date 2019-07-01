"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelCase = require('lodash.camelcase');
const toString = require('lodash.tostring');
const upperfirst = require('lodash.upperfirst');
exports.default = (str) => upperfirst(camelCase(toString(str)));
//# sourceMappingURL=to-upper-camelcase.js.map