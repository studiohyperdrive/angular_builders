import {
	BuilderContext,
	BuilderOutput,
	createBuilder,
} from '@angular-devkit/architect';
import { execute as ngPackagrBuilder, NgPackagrBuilderOptions } from '@angular-devkit/build-ng-packagr';
import { Observable, concat, of } from 'rxjs';

import { BuildLibraryConfig } from './types/config';
import { namedExportsBuilder } from '../named-exports/builder';

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

	const namedExports = options.index ? namedExportsBuilder(options.index, context) : of();

	return concat(
		namedExports,
		ngPackagrBuilder(ngPackagrOptions, context),
	) as any;
}

export default createBuilder(buildLibraryBuilder as any);
