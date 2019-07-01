const TSG = require('ts-json-schema-generator');
const path = require('path');

import toUpperCamelcase from "../utils/to-upper-camelcase";

export default (filePath: string, dir: string) => new Promise((resolve, reject) => {
    try {
        const type = toUpperCamelcase(filePath.replace(/\.model\.ts$/, ''));
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
    } catch (err) {
        reject(err);
    }
});
