const packageJson = {
  dependencies: {
    vorpal: '^1.12.0'
  }
};

const file = `#!/usr/bin/env node
const vorpal = require('vorpal')();
`;

module.exports = {packageJson, file};
