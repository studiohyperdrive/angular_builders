const rimraf = require('rimraf');

export default (target: string) => new Promise((resolve, reject) => {
    rimraf(target, (err: Error) => {
        if (err) {
            return reject(err);
        }

        return resolve(target);
    });
});
