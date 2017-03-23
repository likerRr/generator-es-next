const Generator = require('yeoman-generator');
const path = require('path');
const utils = require('./utils');
const prompts = require('./prompts');
const which = require('which');

module.exports = class extends Generator {
  // get devDependencies() {
  //   // TODO add option to install latest versions or fixed
  //   return {
  //     "ava": "^0.18.2",
  //     "babel-loader": "^6.4.0",
  //     "babel-plugin-istanbul": "^4.0.0",
  //     "babel-preset-env": "^1.2.1",
  //     "babel-register": "^6.24.0",
  //     "codecov": "^2.0.1",
  //     "nyc": "^10.1.2",
  //     "webpack": "2.2.1",
  //     "xo": "^0.17.1"
  //   }
  // }

  constructor(args, opts) {
    super(args, opts);

    this.option('y', {
      description: 'Agree on every question'
    }); // This method adds support for a `--force` flag

    this.configPrompt = this.config.get('promptValues') || {};
    this.defaultAnswers = this._getDefaultAnswers(this.configPrompt);
    this.answers = {};
  }

  // Lifecycle hook
  initializing() {
    return this._initAsync()
      .then(() => this._afterInit());
  }

  // Lifecycle hook
  prompting() {
    return this.prompt(this.questions.ALL).then((answers) => {
      this.answers = answers;
    });
  }

  // Lifecycle hook
  configuring() {
    this._fastCopy('.babelrc');
    this._fastCopy('.editorconfig');
    this._fastCopy('.gitattributes');
    this._fastCopy('.gitignore');
    this._fastCopy('.travis.yml');
  }

  // Lifecycle hook
  // default() {}

  // Lifecycle hook
  writing() {
    this._fastCopy('index.js');
    this._fastCopy('LICENSE', this.answers);
    this._fastCopy('package.json', this.answers);
    this._fastCopy('README.md', this.answers);
    this._fastCopy('test.js');
    this._fastCopy('webpack.config.babel.js');
    // TODO do not copy if want fresh dependencies
    this._fastCopy('yarn.lock');
  }

  // Lifecycle hook
  // conflicts() {}

  // Lifecycle hook
  install() {
    which.sync('yarn') ? this.yarnInstall() : this.npmInstall();
  }

  // Lifecycle hook
  // end() {}

  _fastCopy(fileName, placeholders) {
    return this.fs.copyTpl(
      this.templatePath(fileName),
      this.destinationPath(fileName),
      placeholders
    );
  }

  _getDefaultAnswers(config) {
    const name = config.name || this.user.git.name();
    const email = config.email || this.user.git.email();
    const website = config.website;
    const moduleName = path.basename(process.cwd());
    const moduleDescription = null;
    const githubUsername = config.githubUsername;
    const camelModuleName = utils.camelize(moduleName);
    const humanModuleName = utils.humanize(moduleName);

    return {
      name, email, website, moduleName, moduleDescription, githubUsername, camelModuleName, humanModuleName
    };
  }

  _initAsync() {
    return this._initGithubUsername();
  }

  _initGithubUsername() {
    if (!this.defaultAnswers.userName) {
      return this.user.github.username()
        .then(name => this.defaultAnswers.userName = name);
    }

    return Promise.resolve(this.defaultAnswers.userName);
  }

  _afterInit() {
    this.questions = prompts(this);
  }
};
