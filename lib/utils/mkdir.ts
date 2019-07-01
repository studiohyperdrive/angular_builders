const mkdir = require('make-dir');

export default async (dir: string) => {
	return await mkdir(dir);
};
