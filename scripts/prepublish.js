const fs = require('fs');
const path = require('path');
const cpx = require('cpx');

const {
	name,
	version,
	description,
	files,
	main,
	types,
	builders,
	repository,
	author,
	license,
	bugs,
	homepage,
	dependencies,
} = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), { encoding: 'UTF-8' }));

fs.writeFileSync(path.resolve(process.cwd(), 'dist', 'package.json'), JSON.stringify({
	name,
	version,
	description,
	files,
	main,
	types,
	builders,
	repository,
	author,
	license,
	bugs,
	homepage,
	dependencies,
}, null, 2), { encoding: 'UTF-8' });

cpx.copySync(path.resolve(process.cwd(), 'builders.json'), path.resolve(process.cwd(), 'dist'));
cpx.copySync(path.resolve(process.cwd(), 'LICENSE.md'), path.resolve(process.cwd(), 'dist'));
cpx.copySync(path.resolve(process.cwd(), 'README.md'), path.resolve(process.cwd(), 'dist'));
cpx.copySync(path.resolve(process.cwd(), 'lib', '**', 'schema.json'), path.resolve(process.cwd(), 'dist', 'lib'));
