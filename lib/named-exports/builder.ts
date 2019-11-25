import {
	BuilderContext,
	BuilderOutput,
	createBuilder,
} from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import * as childProcess from 'child_process';
import { join as pathJoin } from 'path';

import { parseOptions} from './parse-options';
import { NamedExportsConfig } from './types/config';

export const namedExportsBuilder = (
	options: NamedExportsConfig,
	context: BuilderContext,
): Observable<BuilderOutput> => {
	const config: NamedExportsConfig = parseOptions(options) as NamedExportsConfig;

	return new Observable((builder$) => {
		const args: string[] = Object.keys(config).reduce((acc: string[], key: string): string[] => [
			...acc,
			`--${key}`,
			(config as any)[key].toString(),
		], []);

		const spawn = childProcess.spawn(
			pathJoin('node_modules', '.bin', 'named-exports'),
			args,
			{ stdio: 'pipe' }
		);

		spawn.stdout.on('data', (data: any) => {
			context.logger.info(data.toString());
		});

		spawn.stderr.on('data', (data: any) => {
			context.logger.error(data.toString());
		});

		spawn.on('close', (code: number) => {
			builder$.next({ success: code === 0 });
			builder$.complete();
		});
	});
};

export default createBuilder(namedExportsBuilder as any);
