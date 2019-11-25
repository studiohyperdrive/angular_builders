import {
	BuilderContext,
	BuilderOutput,
	createBuilder,
} from '@angular-devkit/architect';
import { execute as ngPackagrBuilder, NgPackagrBuilderOptions } from '@angular-devkit/build-ng-packagr';
import { Observable, concat, of } from 'rxjs';

import { BuildLibraryConfig } from './types/config';
import { namedExportsBuilder } from '../named-exports/builder';
import { parseOptions } from '../named-exports/parse-options';

export const buildLibraryBuilder = (
	options: BuildLibraryConfig,
	context: BuilderContext,
): Observable<BuilderOutput> => {
	const ngPackagrOptions: NgPackagrBuilderOptions = Object.keys(options)
		.filter((key) => key !== 'index')
		.reduce((acc, curr) => ({
			...acc,
			[curr]: (options as any)[curr],
		}), {}) as NgPackagrBuilderOptions;
	const namedExportsOptions = parseOptions(options.namedExports, { setDefaults: false });
	const namedExports = namedExportsOptions ? namedExportsBuilder(namedExportsOptions, context) : of();

	return concat(
		namedExports,
		ngPackagrBuilder(ngPackagrOptions, context),
	) as any;
};

export default createBuilder(buildLibraryBuilder as any);
