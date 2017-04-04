'use strict';
const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const fs = require('fs');
const which = require('which');
const shell = require('shelljs');
const gUtils = require('../generators/app/utils');

const prompts = {
  name: 'Alexey',
  email: 'alexey@example.com',
  website: 'https://example.com',
  moduleName: 'generator-es-next',
  moduleDescription: 'test',
  githubUsername: 'likerRr'
};

describe('es-next:app', () => {
  let tmpDir;
  let moduleName = prompts.moduleName;
  let humanName = gUtils.humanize(moduleName);
  let camelName = gUtils.camelize(moduleName);

  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .inTmpDir(dir => tmpDir = dir)
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
        // website can't be taken dynamically, it should be prompted
        website: prompts.website,
        // description is always prompted and never cached
        moduleDescription: prompts.moduleDescription,
        // this can't be tested dynamically since it tries to find github user by git's email, so it would be more
        // stable to use direct user name
        githubUsername: prompts.githubUsername,
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
    body = body.replace(/<%= humanModuleName %>/g, gUtils.humanize(moduleName));
    body = body.replace(/<%= camelModuleName %>/g, gUtils.camelize(moduleName));
    body = body.replace(/<%= name %>/g, prompts.name);

    assert.fileContent('README.md', body);
  });
});
