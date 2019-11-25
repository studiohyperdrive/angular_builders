import { NamedExportsConfig } from "./types/config";

export const parseOptions = (options: any, { setDefaults = true }: { setDefaults?: boolean; } = {}): NamedExportsConfig | null => {
	const config: NamedExportsConfig = {
		dir: options.dir || (setDefaults ? process.cwd() : undefined),
		ignore: options.ignore || (setDefaults ? '*.spec|*.index|test' : undefined),
		fileName: options.fileName || (setDefaults ? 'index' : undefined),
		indent: options.indent || (setDefaults ? 'space' : undefined),
		indentSize: options.indentSize || (setDefaults ? 2 : undefined),
		silent: options.silent !== undefined ? !!options.silent : (setDefaults ? false : undefined),
	};

	const withoutEmpty = Object.keys(config).reduce((acc, curr) => {
		if ((config as any)[curr] !== undefined) {
			return {
				...acc,
				[curr]: (config as any)[curr],
			};
		}

		return acc;
	}, {});

	return Object.keys(withoutEmpty).length ? withoutEmpty as NamedExportsConfig : null;
};
