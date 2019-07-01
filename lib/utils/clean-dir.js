"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rimraf = require('rimraf');
exports.default = (target) => new Promise((resolve, reject) => {
    rimraf(target, (err) => {
        if (err) {
            return reject(err);
        }
        return resolve(target);
    });
});
//# sourceMappingURL=clean-dir.js.map