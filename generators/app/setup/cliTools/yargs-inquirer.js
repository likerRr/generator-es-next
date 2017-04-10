const merge = require('lodash.merge');
const yargs = require('./yargs');
const inquirer = require('./inquirer');

const packageJson = merge({}, yargs.packageJson, inquirer.packageJson);

const file = `#!/usr/bin/env node
const argv = require('yargs').argv;
const inquirer = require('inquirer');
`;

module.exports = {packageJson, file};
