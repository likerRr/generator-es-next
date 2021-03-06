/* global beforeAll, describe, it */
'use strict';
const path = require('path');
const fs = require('fs');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const which = require('which');
const shell = require('shelljs');
const gUtils = require('../generators/app/utils');

const prompts = {
  name: 'Alexey',
  email: 'alexey@example.com',
  website: 'https://example.com',
  moduleName: 'generator-es-next',
  moduleDescription: 'test',
  githubUsername: 'likerRr',
  supportCli: false
};

// eslint-disable-next-line no-undef
describe('es-next:app', () => {
  const moduleName = prompts.moduleName;
  const humanName = gUtils.humanize(moduleName);
  const camelName = gUtils.camelize(moduleName);

  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts(Object.assign({}, prompts));
  });

  it('creates files', () => {
    assert.file([
      '.babelrc',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.travis.yml',
      'index.js',
      'LICENSE',
      'package.json',
      'README.md',
      'test.js',
      'webpack.config.babel.js',
      'yarn.lock'
    ]);
    assert.noFile('cli.js');
  });

  it('placeholders license', () => {
    assert.fileContent('LICENSE', `Copyright (c) ${prompts.name} <${prompts.email}> (${prompts.website})`);
  });

  it('placeholders package.json', () => {
    assert.jsonFileContent('package.json', {
      name: moduleName,
      description: 'test',
      repository: `${prompts.githubUsername}/${moduleName}`,
      author: `${prompts.name} <${prompts.email}> (${prompts.website})`
    });
  });

  it('placeholders readme', () => {
    let body = fs.readFileSync(path.join(__dirname, '../generators/app/templates/README.md'), 'utf8');

    body = body.replace(/<%= githubUsername %>/g, prompts.githubUsername);
    body = body.replace(/<%= moduleName %>/g, moduleName);
    body = body.replace(/<%= humanModuleName %>/g, humanName);
    body = body.replace(/<%= camelModuleName %>/g, camelName);
    body = body.replace(/<%= name %>/g, prompts.name);

    assert.fileContent('README.md', body);
  });
});

describe('es-next:app -d', () => {
  let tmpDir;
  let gitName = '';
  let gitEmail = '';
  let moduleName = '';
  let humanName = '';
  let camelName = '';

  if (which.sync('git')) {
    gitName = shell.exec('git config --get user.name', {silent: true}).stdout.trim();
    gitEmail = shell.exec('git config --get user.email', {silent: true}).stdout.trim();
  }

  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => {
        tmpDir = dir;
        moduleName = path.basename(tmpDir);
        humanName = gUtils.humanize(moduleName);
        camelName = gUtils.camelize(moduleName);
      })
      .withPrompts({
        // Website can't be taken dynamically, it should be prompted
        website: prompts.website,
        // Description is always prompted and never cached
        moduleDescription: prompts.moduleDescription,
        // This can't be tested dynamically since it tries to find github user by git's email, so it would be more
        // Stable to use direct user name
        githubUsername: prompts.githubUsername
      })
      .withOptions({
        d: true
      });
  });

  it('creates files', () => {
    assert.file([
      '.babelrc',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.travis.yml',
      'index.js',
      'LICENSE',
      'package.json',
      'README.md',
      'test.js',
      'webpack.config.babel.js',
      'yarn.lock'
    ]);
  });

  it('placeholders license', () => {
    assert.fileContent('LICENSE', `Copyright (c) ${gitName} <${gitEmail}> (${prompts.website})`);
  });

  it('placeholders package.json', () => {
    assert.jsonFileContent('package.json', {
      name: moduleName,
      description: 'test',
      repository: `${prompts.githubUsername}/${moduleName}`,
      author: `${gitName} <${gitEmail}> (${prompts.website})`
    });
  });

  it('placeholders readme', () => {
    let body = fs.readFileSync(path.join(__dirname, '../generators/app/templates/README.md'), 'utf8');

    body = body.replace(/<%= githubUsername %>/g, prompts.githubUsername);
    body = body.replace(/<%= moduleName %>/g, moduleName);
    body = body.replace(/<%= humanModuleName %>/g, humanName);
    body = body.replace(/<%= camelModuleName %>/g, camelName);
    body = body.replace(/<%= name %>/g, gitName);

    assert.fileContent('README.md', body);
  });
});

describe('es-next:app -y', () => {
  let tmpDir;
  let moduleName = '';
  let humanName = '';
  let camelName = '';

  function mockContext(context) {
    context.user.git.name = () => prompts.name;
    context.user.git.email = () => prompts.email;
    context.user.github.username = () => Promise.resolve(prompts.githubUsername);
  }

  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .on('ready', mockContext)
      .inTmpDir(dir => {
        tmpDir = dir;
        moduleName = path.basename(tmpDir);
        humanName = gUtils.humanize(moduleName);
        camelName = gUtils.camelize(moduleName);
      })
      .withOptions({
        y: true
      });
  });

  it('creates files', () => {
    assert.file([
      '.babelrc',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.travis.yml',
      'index.js',
      'LICENSE',
      'package.json',
      'README.md',
      'test.js',
      'webpack.config.babel.js',
      'yarn.lock'
    ]);
  });

  it('placeholders license', () => {
    assert.fileContent('LICENSE', `Copyright (c) ${prompts.name} <${prompts.email}> ()`);
  });

  it('placeholders package.json', () => {
    assert.jsonFileContent('package.json', {
      name: moduleName,
      description: '',
      repository: `${prompts.githubUsername}/${moduleName}`,
      author: `${prompts.name} <${prompts.email}> ()`
    });
  });

  it('placeholders readme', () => {
    let body = fs.readFileSync(path.join(__dirname, '../generators/app/templates/README.md'), 'utf8');

    body = body.replace(/<%= githubUsername %>/g, prompts.githubUsername);
    body = body.replace(/<%= moduleName %>/g, moduleName);
    body = body.replace(/<%= humanModuleName %>/g, humanName);
    body = body.replace(/<%= camelModuleName %>/g, camelName);
    body = body.replace(/<%= name %>/g, prompts.name);

    assert.fileContent('README.md', body);
  });
});

describe('es-next:app testingTools=ava', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        testingTools: 'ava'
      });
  });

  it('creates files', () => {
    assert.file([
      'test.js',
      'package.json'
    ]);
  });

  it('patches package.json', () => {
    assert.jsonFileContent('package.json', require('../generators/app/setup/ava').packageJson);
  });

  it('creates test file', () => {
    assert.fileContent('test.js', require('../generators/app/setup/ava').test);
  });
});

describe('es-next:app testingTools=jest -y', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({
        y: true
      });
  });

  it('creates files', () => {
    assert.file([
      'test.js',
      'package.json'
    ]);
  });

  it('patches package.json', () => {
    assert.jsonFileContent('package.json', require('../generators/app/setup/jest').packageJson);
  });

  it('creates test file', () => {
    assert.fileContent('test.js', require('../generators/app/setup/jest').test);
  });
});

describe('es-next:app supportCli=true cliTools=native', () => testCliTools('native'));
describe('es-next:app supportCli=true cliTools=yargs', () => testCliTools('yargs'));
describe('es-next:app supportCli=true cliTools=inquirer', () => testCliTools('inquirer'));
describe('es-next:app supportCli=true cliTools=vorpal', () => testCliTools('vorpal'));
describe('es-next:app supportCli=true cliTools=meow', () => testCliTools('meow'));
describe('es-next:app supportCli=true cliTools=yargs+inquirer', () => testCliTools('yargs-inquirer'));
describe('es-next:app supportCli=true cliTools=yargs+vorpal', () => testCliTools('yargs-vorpal'));

function testCliTools(cliTool) {
  assert.ok(['inquirer', 'meow', 'native', 'vorpal', 'yargs', 'yargs-inquirer', 'yargs-vorpal'].includes(cliTool));

  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        supportCli: true,
        cliTools: cliTool
      });
  });

  it('creates files', () => {
    assert.file('cli.js');
  });

  it('patches package.json', () => {
    assert.jsonFileContent('package.json', require('../generators/app/setup/cliTools')(cliTool).packageJson);
  });

  it('creates cli file', () => {
    assert.fileContent('cli.js', require('../generators/app/setup/cliTools')(cliTool).file);
  });
}
