const merge = require('lodash.merge');
const yargs = require('./yargs');
const vorpal = require('./vorpal');
const packageJson = merge({}, yargs.packageJson, vorpal.packageJson);

const file = `#!/usr/bin/env node
const argv = require('yargs').argv;
const vorpal = require('vorpal')();
`;

module.exports = {packageJson, file};
