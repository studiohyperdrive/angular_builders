"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const architect_1 = require("@angular-devkit/architect");
const glob = require('glob');
const path = require('path');
const clean_dir_1 = require("../utils/clean-dir");
const mkdir_1 = require("../utils/mkdir");
const generate_schema_1 = require("./generate-schema");
const validator_1 = require("./validator");
const findSchemas = (dir) => new Promise((resolve, reject) => {
    glob(path.join(dir, '**/types/*.model.ts'), (err, files) => {
        if (err) {
            return reject(err);
        }
        const filesByDir = files.map((file) => file.split('/types/'));
        const schemas = filesByDir.reduce((acc, curr) => {
            acc[curr[0]] = acc[curr[0]] || [];
            acc[curr[0]].push(curr[1]);
            return acc;
        }, {});
        resolve(schemas);
    });
});
const buildSchemasForDir = (dir, schemas, styleOptions) => {
    return clean_dir_1.default(path.join(dir, 'schemas'))
        .then(() => mkdir_1.default(path.join(dir, 'schemas')))
        .then(() => Promise.all(schemas.map((filePath => {
        return generate_schema_1.default(filePath, dir)
            .then(({ schema, type }) => validator_1.default(dir, schema, type, styleOptions));
    }))));
};
const buildSchemas = (schemasByDir, config) => {
    return Promise.all(Object.keys(schemasByDir).map((dir) => buildSchemasForDir(dir, schemasByDir[dir], config)));
};
exports.default = architect_1.createBuilder((options, context) => {
    const config = {
        dir: options.dir || process.cwd(),
        ignore: options.ignore || '*.spec|*.index|test',
        indent: options.indent || 'space',
        indentSize: options.indentSize || 2,
    };
    if (options.silent) {
        config.silent = true;
    }
    return new Promise((resolve) => {
        findSchemas(config.dir)
            .then((schemas) => buildSchemas(schemas, config))
            .then(() => {
            context.reportStatus('Done');
            resolve({
                success: true,
            });
        })
            .catch(() => {
            context.reportStatus('Error');
            resolve({
                success: false,
            });
        });
    });
});
//# sourceMappingURL=builder.js.map