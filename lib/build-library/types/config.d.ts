import { NgPackagrBuilderOptions } from '@angular-devkit/build-ng-packagr';

import { NamedExportsConfig } from '../../named-exports/types/config';

export type BuildLibraryConfig = NgPackagrBuilderOptions & {
	index?: NamedExportsConfig;
};
