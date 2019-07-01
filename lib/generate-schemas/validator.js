"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lowerCase = require('lodash.lowercase');
const { readFileSync, writeFileSync } = require('fs');
const { js: beautify } = require('js-beautify');
const path = require('path');
const compileValidator = (schema, type, typePath, styleOptions) => {
    const validatorTpl = readFileSync(`${process.cwd()}/scripts/validator.tpl.js`, { encoding: 'UTF-8' });
    const jsonData = Object.keys(schema.definitions[type].properties).reduce((acc, curr, i, arr) => {
        acc += `${curr}: this.data.${curr},\n`;
        if (i === arr.length - 1) {
            return acc += '}';
        }
        return acc;
    }, '{\n');
    const result = validatorTpl
        .replace(/\{\{ TYPE }}/g, type)
        .replace('{{ TYPE_PATH }}', typePath)
        .replace('{{ JSON }}', jsonData)
        .replace('{{ SCHEMA }}', `
        // tslint:disable
        ${JSON.stringify(schema, null, 2)}
        // tslint:enable
        `);
    return beautify(result, {
        indent_size: styleOptions.indentSize || 2,
        indent_with_tabs: styleOptions.indent === 'tabs',
        end_with_newline: true,
    }).replace(/\s\?\s:/g, '?:');
};
exports.default = (outputPath, schema, type, styleOptions) => new Promise((resolve, reject) => {
    try {
        // TODO: fix file name
        const template = compileValidator(schema, type, path.join('..', 'types', `${lowerCase(type)}.model`), styleOptions);
        writeFileSync(`${outputPath}/schemas/${lowerCase(type || 'schema')}.ts`, template);
        resolve();
    }
    catch (e) {
        reject(e);
    }
});
//# sourceMappingURL=validator.js.map