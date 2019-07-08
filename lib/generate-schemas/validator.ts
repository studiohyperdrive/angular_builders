const kebabCase = require('lodash.kebabcase');
const template = require('lodash.template');
const { readFileSync, writeFileSync } = require('fs');
const { js: beautify } = require('js-beautify');
const path = require('path');

import { GenerateSchemasConfig } from './types/config';

const compileValidator = (schema: any, type: string, typePath: string, styleOptions: Partial<GenerateSchemasConfig>) => {
	const validatorTpl = readFileSync(path.join(__dirname, 'validator.tpl'), { encoding: 'UTF-8' });
	const jsonData = Object.keys(schema.definitions[type].properties).reduce((acc, curr, i, arr) => {
        acc += `${curr}: this.data.${curr},\n`;

        if (i === arr.length - 1) {
            return acc += '}';
        }

        return acc;
	}, '{\n');
	const compiler = template(validatorTpl);
	const result = compiler({
		type,
		typePath,
		jsonData,
		schema: `
		// tslint:disable
        ${JSON.stringify(schema, null, 2)}
        // tslint:enable
		`
	});

    return beautify(result, {
        indent_size: styleOptions.indentSize || 2,
        indent_with_tabs: styleOptions.indent === 'tabs',
        end_with_newline: true,
    }).replace(/\s\?\s:/g, '?:');
};

export default (
	outputPath: string,
	schema: any,
	type: string,
	styleOptions: Partial<GenerateSchemasConfig>,
) => new Promise((resolve, reject) => {
    try {
		const typePath = kebabCase(type);
        const template = compileValidator(schema, type, path.join('..', 'types', `${typePath}.model`), styleOptions);

        writeFileSync(`${outputPath}/schemas/${type ? typePath : 'schema'}.schema.ts`, template);

        resolve();
    } catch (e) {
        reject(e);
    }
});
