'use strict';
const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const fs = require('fs');

const prompts = {
  name: 'Alexey',
  email: 'alexey@example.com',
  website: 'https://example.com',
  moduleDescription: 'test',
  githubUsername: 'example',
  moduleName: 'example-module'
};

describe('es-next:app', () => {
  let tmpDir;
  let moduleName = prompts.moduleName;
  let humanName = 'Example Module';
  let camelName = 'exampleModule';

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
