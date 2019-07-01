"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TSG = require('ts-json-schema-generator');
const path = require('path');
const to_upper_camelcase_1 = require("../utils/to-upper-camelcase");
exports.default = (filePath, dir) => new Promise((resolve, reject) => {
    try {
        const type = to_upper_camelcase_1.default(filePath.replace(/\.model\.ts$/, ''));
        const generatorConfig = {
            type,
            path: path.join(dir, 'types', filePath),
            expose: 'export',
            topRef: true,
            jsDoc: 'basic',
            strictTuples: true,
        };
        const generator = TSG.createGenerator(generatorConfig);
        const schema = generator.createSchema(type);
        resolve({ schema, type });
    }
    catch (err) {
        reject(err);
    }
});
//# sourceMappingURL=generate-schema.js.map