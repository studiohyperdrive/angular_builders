import {
	Builder,
	BuilderConfiguration,
	BuilderContext,
	BuildEvent,
} from '@angular-devkit/architect';
import { Observable, Subject } from 'rxjs';
import * as childProcess from 'child_process';

import { NamedExportsConfig } from './types/config';

export default class NamedExportsBuilder implements Builder<NamedExportsConfig> {
	constructor(
		private context: BuilderContext,
	) { }

	run(builderConfig: BuilderConfiguration<Partial<NamedExportsConfig>>): Observable<BuildEvent> {
		const config: NamedExportsConfig = {
			dir: builderConfig.options.dir || process.cwd(),
			ignore: builderConfig.options.ignore || '*.spec|*.index|test',
			fileName: builderConfig.options.fileName || 'index',
			indent: builderConfig.options.indent || 'space',
			indentSize: builderConfig.options.indentSize || 2,
		};

		if (builderConfig.options.silent) {
			config.silent = true;
		}

		const builder$ = new Subject<BuildEvent>();

		const args: string[] = Object.keys(config).reduce((acc: string[], key: string): string[] => [
			...acc,
			`--${key}`,
			(config as any)[key].toString(),
		], []);

		const spawn = childProcess.spawn(
			'./node_modules/.bin/named-exports',
			args,
			{ stdio: 'pipe' }
		);

		spawn.stdout.on('data', (data: any) => {
			this.context.logger.info(data.toString());
		});

		spawn.stderr.on('data', (data: any) => {
			this.context.logger.error(data.toString());
		});

		spawn.on('close', (code: number) => {
			builder$.next({ success: code === 0 });
		});

		return builder$;
	}
}
