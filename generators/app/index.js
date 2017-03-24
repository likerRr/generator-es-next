const Generator = require('yeoman-generator');
const path = require('path');
const utils = require('./utils');
const prompts = require('./prompts');
const which = require('which');

const OPTIONS = {
  // COMMIT: 'commit',
  // INIT_GIT: 'git',
  LATEST: 'latest',
  // PUSH: 'push',
  YES: 'yes',
  YES_DEFAULT: 'yes-defaults'
};

// TODO replace file names with map
// const TEMPLATES = {
//   README: {
//     name: 'readme.md',
//     placeholders: []
//   }
// };

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

    this.option('yes-default', {
      alias: 'd',
      default: false,
      description: `Ask only questions which don't have default or saved answer`,
      type: Boolean
    });

    this.option(OPTIONS.YES, {
      alias: 'y',
      default: false,
      description: `Agree on every question, don't ask anything`,
      type: Boolean
    });

    // this.option(OPTIONS.INIT_GIT, {
    //   alias: 'g',
    //   default: true,
    //   description: `Init git repository`,
    //   type: Boolean
    // });

    // this.option(OPTIONS.COMMIT, {
    //   alias: 'c',
    //   default: true,
    //   description: `Make initial commit`,
    //   type: Boolean
    // });

    // this.option(OPTIONS.PUSH, {
    //   alias: 'p',
    //   default: false,
    //   description: `Push commit`,
    //   type: Boolean
    // });

    this.option(OPTIONS.LATEST, {
      alias: 'l',
      default: false,
      description: `Install latest versions of dependencies. (!) Correct work is not guaranteed`,
      type: Boolean
    });

    this.storedPrompt = this.config.get('promptValues') || {};
    this.defaultAnswers = this._getDefaultAnswers(this.storedPrompt);
    this.answers = {};
  }

  // Lifecycle hook
  initializing() {
    return this._beforeInit()
      .then(() => this._afterInit());
  }

  // Lifecycle hook
  prompting() {
    return this._getAnswers()
      .then(answers => {
        this.answers = answers
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
    this._installDependencies({
      isYarn: which.sync('yarn')
    });

    // if git is available
      // init git

      // make commit

      // if github repo exists && user agreed
        // push
  }

  // Lifecycle hook
  // end() {}

  /**
   *
   * @param isYarn
   * @private
   */
  _installDependencies({isYarn}) {
    let dependencies = [];
    let devDependencies = [];

    if (this.options[OPTIONS.LATEST]) {
      const packageJson = require(this.templatePath('package.json'));
      const setLatest = dep => `${dep}@latest`;

      dependencies = Object.keys(packageJson.dependencies).map(setLatest);
      devDependencies = Object.keys(packageJson.devDependencies).map(setLatest);
    }

    isYarn
      ? this.yarnInstall(dependencies)
      : this.npmInstall(dependencies);

    if (devDependencies.length > 0) {
      isYarn
        ? this.yarnInstall(devDependencies, {dev: true})
        : this.npmInstall(devDependencies, {'save-dev': true});
    }
  }

  /**
   * Returns answers either after prompting or on
   * @return {Promise}
   * @private
   */
  _getAnswers() {
    return new Promise((resolve, reject) => {
      try {
        if (this.options[OPTIONS.YES_DEFAULT]) {
          // resolve questions that don't have default or stored answer
          const filtered = this.questions.ALL.filter(q => !this.defaultAnswers[q.name]);

          resolve(this.prompt(filtered).then(answers => {
            // combine answers with defaults
            return Object.assign({}, this.defaultAnswers, answers);
          }));
        } else if (this.options[OPTIONS.YES]) {
          // don't ask anything, just return answers
          resolve(Object.assign({}, this.defaultAnswers));
        } else {
          // ask all the questions
          resolve(this.prompt(this.questions.ALL));
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Copies fileName to destination path with the same name
   * @param fileName
   * @param placeholders
   * @return {*}
   * @private
   */
  _fastCopy(fileName, placeholders) {
    return this.fs.copyTpl(
      this.templatePath(fileName),
      this.destinationPath(fileName),
      placeholders
    );
  }

  /**
   * Returns merged map of stored and default answers
   * @param config
   * @return {{name: *, email: *, website: null, moduleName: *, moduleDescription: *, githubUsername: null, camelModuleName: string, humanModuleName: string}}
   * @private
   */
  _getDefaultAnswers(config) {
    const name = config.name || this.user.git.name();
    const email = config.email || this.user.git.email();
    const website = config.website || null;
    const moduleName = path.basename(process.cwd());
    const moduleDescription = null;
    const githubUsername = config.githubUsername || null;
    const camelModuleName = utils.camelize(moduleName);
    const humanModuleName = utils.humanize(moduleName);
    // const gitRemote = githubUsername && `${githubUsername}/${moduleName}`;

    return {
      name, email, website, moduleName, moduleDescription, githubUsername, camelModuleName, humanModuleName
      // gitRemote
    };
  }

  /**
   * Async operations before initialing (load data, etc.)
   * @return {*}
   * @private
   */
  _beforeInit() {
    return this._initGithubUsername();
  }

  _initGithubUsername() {
    if (!this.defaultAnswers.githubUsername) {
      return this.user.github.username()
        .then(name => this.defaultAnswers.githubUsername = name);
    }

    return Promise.resolve(this.defaultAnswers.githubUsername);
  }

  _afterInit() {
    this.questions = prompts(this);
  }
};
