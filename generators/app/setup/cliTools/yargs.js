const packageJson = {
  dependencies: {
    yargs: '^7.0.2'
  }
};

const file = `#!/usr/bin/env node
const argv = require('yargs').argv;
`;

module.exports = {packageJson, file};
