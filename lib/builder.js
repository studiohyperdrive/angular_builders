"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const architect_1 = require("@angular-devkit/architect");
const childProcess = require("child_process");
exports.default = architect_1.createBuilder((options, context) => {
    const config = {
        dir: options.dir || process.cwd(),
        ignore: options.ignore || '*.spec|*.index|test',
        fileName: options.fileName || 'index',
        indent: options.indent || 'space',
        indentSize: options.indentSize || 2,
    };
    if (options.silent) {
        config.silent = true;
    }
    const args = Object.keys(config).reduce((acc, key) => [
        ...acc,
        `--${key}`,
        config[key].toString(),
    ], []);
    const spawn = childProcess.spawn('./node_modules/.bin/named-exports', args, { stdio: 'pipe' });
    spawn.stdout.on('data', (data) => {
        context.logger.info(data.toString());
    });
    spawn.stderr.on('data', (data) => {
        context.logger.error(data.toString());
    });
    return new Promise((resolve) => {
        context.reportStatus('Done');
        spawn.on('close', (code) => {
            resolve({ success: code === 0 });
        });
    });
});
//# sourceMappingURL=builder.js.map