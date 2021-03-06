const path = require('path');
const Generator = require('yeoman-generator');
const which = require('which');
const utils = require('./utils');
const prompts = require('./prompts');

const OPTIONS = {
  GIT_INIT: 'git-init',
  GIT_PUSH: 'git-push',
  LATEST: 'latest',
  YES: 'yes',
  YES_DEFAULT: 'yes-defaults'
};

const TEMPLATES = {
  BABELRC: '.babelrc',
  EDITORCONFIG: '.editorconfig',
  GIT_ATTRIBUTES: '.gitattributes',
  GIT_IGNORE: '.gitignore',
  TRAVIS: '.travis.yml',

  INDEX: 'index.js',
  LICENSE: 'LICENSE',
  PACKAGE: 'package.json',
  README: 'README.md',
  TEST: 'test.js',
  CLI: 'cli.js',
  WEBPACK: 'webpack.config.babel.js',
  YARN: 'yarn.lock'
};

module.exports = class extends Generator {
  get _gitRemote() {
    if (this._authorModule) {
      return `https://github.com/${this._authorModule}`;
    }

    return null;
  }

  get _authorModule() {
    if (this.answers.githubUsername && this.answers.moduleName) {
      return `${this.answers.githubUsername}/${this.answers.moduleName}`;
    }

    return null;
  }

  get _packageManager() {
    return which.sync('yarn') ? 'yarn' : 'npm';
  }

  get _actualTemplates() {
    const result = {};

    for (const key in TEMPLATES) {
      if (TEMPLATES[key] === TEMPLATES.CLI && !this.answers.supportCli) {
        continue;
      }

      result[key] = TEMPLATES[key];
    }

    return result;
  }

  constructor(args, opts) {
    super(args, opts);

    this.option(OPTIONS.YES_DEFAULT, {
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

    this.option(OPTIONS.GIT_INIT, {
      alias: 'g',
      default: true,
      description: `Init git repository and make initial commit`,
      type: Boolean
    });

    this.option(OPTIONS.GIT_PUSH, {
      alias: 'p',
      default: false,
      description: `Push commit`,
      type: Boolean
    });

    this.option(OPTIONS.LATEST, {
      alias: 'l',
      default: false,
      description: `Install latest versions of dependencies. (!) Correct work is not guaranteed`,
      type: Boolean
    });
  }

  // Lifecycle hook
  initializing() {
    this.storedPrompt = this.config.get('promptValues') || {};
    this.defaultAnswers = this._getDefaultAnswers(this.storedPrompt);
    this.answers = {};

    return this._beforeInit()
      .then(() => this._afterInit());
  }

  // Lifecycle hook
  prompting() {
    return this._getAnswers()
      .then(answers => {
        this.answers = answers;
      });
  }

  // Lifecycle hook
  configuring() {
    this._fastCopy(TEMPLATES.BABELRC);
    this._fastCopy(TEMPLATES.EDITORCONFIG);
    this._fastCopy(TEMPLATES.GIT_ATTRIBUTES);
    this._fastCopy(TEMPLATES.GIT_IGNORE);
    this._fastCopy(TEMPLATES.TRAVIS);
  }

  // Lifecycle hook
  // default() {}

  // Lifecycle hook
  writing() {
    this._fastCopy(TEMPLATES.INDEX);
    this._fastCopy(TEMPLATES.LICENSE, this.answers);
    this._fastCopy(TEMPLATES.PACKAGE, this.answers);
    this._fastCopy(TEMPLATES.README, this.answers);
    this._fastCopy(TEMPLATES.WEBPACK, this.answers);
    this._fastCopy(TEMPLATES.YARN);

    if (this.answers.testingTools) {
      const testSetup = require(`./setup/${this.answers.testingTools}`);

      this.fs.extendJSON(this.destinationPath(TEMPLATES.PACKAGE), testSetup.packageJson);
      this.fs.write(this.destinationPath(TEMPLATES.TEST), testSetup.test);
    }

    if (this.answers.supportCli) {
      const cliSetup = require(`./setup/cliTools`)(this.answers.cliTools.replace('+', '-'));

      this.fs.extendJSON(this.destinationPath(TEMPLATES.PACKAGE), cliSetup.packageJson);
      this.fs.write(this.destinationPath(TEMPLATES.CLI), cliSetup.file);
    }
  }

  // Lifecycle hook
  // conflicts() {}

  // Lifecycle hook
  install() {
    this._installDependencies({
      isYarn: which.sync('yarn')
    });

    if (which.sync('git')) {
      if (this.options[OPTIONS.GIT_INIT]) {
        this.spawnCommandSync('git', ['init']);
        this.spawnCommandSync('git', ['add'].concat(utils.objValues(this._actualTemplates)));
        this.spawnCommandSync('git', ['commit', '-m', 'Initial']);

        if (this.options[OPTIONS.GIT_PUSH]) {
          utils.isRepoExists(this._authorModule, isExists => {
            if (!isExists) {
              return this.log(`Remote url not found`);
            }

            this.spawnCommandSync('git', ['remote', 'add', 'origin', this._gitRemote]);
            this.spawnCommand('git', ['push', '-u', 'origin', 'master']);
          });
        }
      }
    }
  }

  // Lifecycle hook
  end() {
    // In test environment files are not copied and dependencies are not installed
    if (process.env.NODE_ENV !== 'test') {
      this.spawnCommand(this._packageManager, ['test']);
    }
  }

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

    // eslint-disable-next-line no-unused-expressions
    isYarn ?
      this.yarnInstall(dependencies) :
      this.npmInstall(dependencies);

    if (devDependencies.length > 0) {
      // eslint-disable-next-line no-unused-expressions
      isYarn ?
        this.yarnInstall(devDependencies, {dev: true}) :
        this.npmInstall(devDependencies, {'save-dev': true});
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
          // Resolve questions that don't have default or stored answer
          const withoutDefaultAnswers = this.questions.ALL.filter(q => {
            return this.defaultAnswers[q.name] === null || this.defaultAnswers[q.name] === undefined;
          });

          resolve(this.prompt(withoutDefaultAnswers).then(answers => {
            // Combine answers with defaults
            return Object.assign({}, this.defaultAnswers, answers);
          }));
        } else if (this.options[OPTIONS.YES]) {
          // Don't ask anything, just return answers
          resolve(Object.assign({}, this.defaultAnswers));
        } else {
          // Ask all the questions
          resolve(this.prompt(this.questions.ALL));
        }
      } catch (err) {
        reject(err);
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
   * @param stored
   * @return {{name: *, email: *, website: null, moduleName: *, moduleDescription: *, githubUsername: null, camelModuleName: string, humanModuleName: string}}
   * @private
   */
  _getDefaultAnswers(stored) {
    const name = stored.name || this.user.git.name();
    const email = stored.email || this.user.git.email();
    const website = stored.website || null;
    const moduleName = path.basename(process.cwd());
    const moduleDescription = null;
    const githubUsername = stored.githubUsername || null;
    const camelModuleName = utils.camelize(moduleName);
    const humanModuleName = utils.humanize(moduleName);
    const testingTools = stored.testingTools || 'jest';
    const supportCli = Boolean(stored.supportCli || false);
    const cliTools = stored.cliTools || 'yargs';

    return {
      name,
      email,
      website,
      moduleName,
      moduleDescription,
      githubUsername,
      camelModuleName,
      humanModuleName,
      testingTools,
      supportCli,
      cliTools
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
      try {
        return this.user.github.username()
          // If no username, then return null
          .catch(() => null)
          .then(name => this.defaultAnswers.githubUsername = name); // eslint-disable-line no-return-assign
      } catch (err) {
        return Promise.resolve(null);
      }
    }

    return Promise.resolve(this.defaultAnswers.githubUsername);
  }

  _afterInit() {
    this.questions = prompts(this);
  }
};
