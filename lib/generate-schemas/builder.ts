import {
	Builder,
	BuilderConfiguration,
	BuilderContext,
	BuildEvent,
} from '@angular-devkit/architect';
import { Observable, Subject } from 'rxjs';
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

export default class GenerateSchemasBuilder implements Builder<GenerateSchemasConfig> {
	constructor(
		private context: BuilderContext,
	) {}

	run(builderConfig: BuilderConfiguration<Partial<GenerateSchemasConfig>>): Observable<BuildEvent> {
		const config: GenerateSchemasConfig = {
			dir: builderConfig.options.dir || process.cwd(),
			ignore: builderConfig.options.ignore || '*.spec|*.index|test', // TODO: implement this
			indent: builderConfig.options.indent || 'space',
			indentSize: builderConfig.options.indentSize || 2,
			tsconfig: builderConfig.options as string, // verified in generate-schema
		};

		if (builderConfig.options.silent) {
			config.silent = true;
		}

		const builder$ = new Subject<BuildEvent>();

		findSchemas(config.dir)
			.then((schemas: any) => buildSchemas(schemas, config))
			.then(() => {
				this.context.logger.info("Schemas generated...");

				builder$.next({
					success: true,
				});
				builder$.complete();
			})
			.catch((err) => {
				this.context.logger.error("Schema generation failed");
				this.context.logger.error(typeof err === 'string' ? err : err.message);

				builder$.next({
					success: false,
				});
				builder$.complete();
			});

		return builder$;
	}
}
