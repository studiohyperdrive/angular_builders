import { BuilderOutput, createBuilder } from '@angular-devkit/architect';
import * as childProcess from 'child_process';

export interface NamedExportsConfig {
    dir: string;
    ignore: string;
    fileName: string;
    indent: string;
    indentSize: number;
    silent?: boolean;
}

export default createBuilder((options: Partial<NamedExportsConfig>, context) => {
    const config: NamedExportsConfig = {
        dir: options.dir || process.cwd(),
        ignore: options.ignore || '*.spec|*.index|test',
        fileName: options.fileName || 'index',
        indent: options.indent || 'space',
        indentSize: options.indentSize || 2,
    };
    if (options.silent) {
        config.silent = true;
    }
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
        context.logger.info(data.toString());
    });

    spawn.stderr.on('data', (data: any) => {
        context.logger.error(data.toString());
    });

    return new Promise<BuilderOutput>((resolve) => {
        context.reportStatus('Done');

        spawn.on('close', (code: number) => {
            resolve({ success: code === 0 });
        });
    });
});
