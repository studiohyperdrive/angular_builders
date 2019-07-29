const TSG = require('ts-json-schema-generator');
const path = require('path');

import toUpperCamelcase from "../utils/to-upper-camelcase";
import { GenerateSchemasConfig } from "./types/config";

export default (filePath: string, dir: string, options: Partial<GenerateSchemasConfig>) => new Promise((resolve, reject) => {
    try {
        const type = toUpperCamelcase(filePath.replace(/\.model\.ts$/, ''));
        const generatorConfig = {
			config: options.tsconfig || path.join(process.cwd(), 'tsconfig.json'),
			skipTypeCheck: options.skipTypeCheck || true, // TODO: re-enable once this is fixed: https://github.com/vega/ts-json-schema-generator/pull/109
			strictTuples: options.strictTuples || true,
            expose: options.expose || 'export',
            jsDoc: options.jsDoc || 'extended',
            path: path.join(dir, 'types', filePath),
            topRef: options.topRef || true,
            type,
        };

        const generator = TSG.createGenerator(generatorConfig);
        const schema = generator.createSchema(type);

        resolve({ schema, type });
    } catch (err) {
        reject(err);
    }
});
