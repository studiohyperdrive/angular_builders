import { BuilderOutput, createBuilder } from '@angular-devkit/architect';
const glob = require('glob');
const path = require('path');

import cleanup from '../utils/clean-dir';
import verifyOutput from '../utils/mkdir';
import generateSchema from './generate-schema';
import { GenerateSchemasConfig } from './types/config';
import createValidator from './validator';

const findSchemas = (dir: string) => new Promise((resolve, reject) => {
    glob(path.join(dir, '**/types/*.model.ts'), (err: Error, files: string[]) => {
        if (err) {
            return reject(err);
        }

        const filesByDir: string[][] = files.map((file) => file.split('/types/'));

        const schemas = filesByDir.reduce((acc: { [index: string]: string[]; }, curr: string[]) => {
            acc[curr[0]] = acc[curr[0]] || [];

            acc[curr[0]].push(curr[1]);

            return acc;
        }, {});

        resolve(schemas);
    });
});

const buildSchemasForDir = (dir: string, schemas: string[], styleOptions: Partial<GenerateSchemasConfig>) => {
    return cleanup(path.join(dir, 'schemas'))
        .then(() => verifyOutput(path.join(dir, 'schemas')))
        .then(() => Promise.all(schemas.map((filePath => {
            return generateSchema(filePath, dir)
                .then(({ schema, type }) => createValidator(dir, schema, type, styleOptions));
        }))));
};

const buildSchemas = (
	schemasByDir: {
		[index: string]: string[];
	},
	config: GenerateSchemasConfig,
) => {
	return Promise.all(Object.keys(schemasByDir).map((dir: string) => buildSchemasForDir(dir, schemasByDir[dir], config)))
};

export default createBuilder((options: Partial<GenerateSchemasConfig>, context) => {
    const config: GenerateSchemasConfig = {
        dir: options.dir || process.cwd(),
        ignore: options.ignore || '*.spec|*.index|test',
        indent: options.indent || 'space',
        indentSize: options.indentSize || 2,
	};

    if (options.silent) {
        config.silent = true;
	}

	return new Promise<BuilderOutput>((resolve) => {
		findSchemas(config.dir)
			.then((schemas: any) => buildSchemas(schemas, config))
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
