const TSG = require('ts-json-schema-generator');
const path = require('path');

import toUpperCamelcase from "../utils/to-upper-camelcase";
import { GenerateSchemasConfig } from "./types/config";

const verifyTsConfig = (options: Partial<GenerateSchemasConfig>): string => {
	if (!options || !options.tsconfig) {
		return path.join(process.cwd(), 'tsconfig.json');
	}

	if (options.tsconfig.charAt(0) === '/') {
		return options.tsconfig;
	}

	return path.resolve(process.cwd(), options.tsconfig);
};

export default (filePath: string, dir: string, options: Partial<GenerateSchemasConfig>) => new Promise((resolve, reject) => {
    try {
        const type = toUpperCamelcase(filePath.replace(/\.model\.ts$/, ''));
        const generatorConfig = {
			tsconfig: verifyTsConfig(options),
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
