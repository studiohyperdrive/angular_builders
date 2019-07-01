const camelCase = require('lodash.camelcase');
const toString = require('lodash.tostring');
const upperfirst = require('lodash.upperfirst');

export default (str: any) => upperfirst(camelCase(toString(str)));
