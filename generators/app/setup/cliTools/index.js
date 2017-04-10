const merge = require('lodash.merge');

const packageJson = {
  bin: './cli.js'
};

function loadCliConfig(name) {
  return require(`./${name}`);
}

module.exports = name => merge({packageJson}, loadCliConfig(name));
