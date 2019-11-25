import {
	BuilderContext,
	BuilderOutput,
	createBuilder,
} from '@angular-devkit/architect';
import { Observable } from 'rxjs';
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

const buildSchemasForDir = (dir: string, schemas: string[], options: Partial<GenerateSchemasConfig>) => {
    return cleanup(path.join(dir, 'schemas'))
        .then(() => verifyOutput(path.join(dir, 'schemas')))
        .then(() => Promise.all(schemas.map((filePath => {
            return generateSchema(filePath, dir, options)
                .then(({ schema, type }) => createValidator(dir, schema, type, options));
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

export const generateSchemas = (
	options: GenerateSchemasConfig,
	context: BuilderContext,
): Observable<BuilderOutput> => {
	const config: GenerateSchemasConfig = {
		dir: options.dir || process.cwd(),
		ignore: options.ignore || '*.spec|*.index|test', // TODO: implement this
		indent: options.indent || 'space',
		indentSize: options.indentSize || 2,
		tsconfig: options.tsconfig, // verified in generate-schema
	};

	if (options.silent) {
		config.silent = true;
	}

	return new Observable((builder$) => {
		findSchemas(config.dir)
			.then((schemas: any) => buildSchemas(schemas, config))
			.then(() => {
				context.logger.info("Schemas generated...");

				builder$.next({
					success: true,
				});
				builder$.complete();
			})
			.catch((err) => {
				context.logger.error("Schema generation failed");
				context.logger.error(typeof err === 'string' ? err : err.message);

				builder$.next({
					success: false,
				});
				builder$.complete();
			});
	});
};

export default createBuilder(generateSchemas as any);
