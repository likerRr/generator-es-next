const packageJson = {
  dependencies: {
    inquirer: '^3.0.6'
  }
};

const file = `#!/usr/bin/env node
const inquirer = require('inquirer');
`;

module.exports = {packageJson, file};
