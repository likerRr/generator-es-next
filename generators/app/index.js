const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('y', {
      description: 'Agree on every question'
    }); // This method adds support for a `--force` flag
  }

  install() {
    this.log('install in process');
  }
};
