const packageJson = {
  dependencies: {
    meow: '^3.7.0'
  }
};

const file = `#!/usr/bin/env node
const cli = require('meow')();
`;

module.exports = {packageJson, file};
