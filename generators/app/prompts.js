const utils = require('./utils');
const trimFilter = (val) => val.trim();

module.exports = generator => {
  const prompts = {};

  prompts.askName = {
    default: generator.defaultAnswers.name,
    filter: trimFilter,
    name: 'name',
    message: `What's your name?`,
    store: true,
    type: 'input'
  };

  prompts.askEmail = {
    default: generator.defaultAnswers.email,
    filter: trimFilter,
    name: 'email',
    message: `What's your email?`,
    store: true,
    type: 'input'
  };

  prompts.askSite = {
    default: generator.defaultAnswers.website,
    filter: trimFilter,
    message: `What's your web site?`,
    name: 'website',
    store: true,
    type: 'input'
  };

  prompts.askModuleName = {
    default: generator.defaultAnswers.moduleName,
    filter: trimFilter,
    message: `What's the module name?`,
    name: 'moduleName',
    type: 'input'
  };

  prompts.askCamelModuleName = {
    default: session => utils.camelize(session.moduleName),
    filter: trimFilter,
    message: `What's a camelCase for module name?`,
    name: 'camelModuleName',
    type: 'input'
  };

  // TODO now is not used, put somewhere in README.md
  prompts.askHumanModuleName = {
    default: session => utils.humanize(session.moduleName),
    filter: trimFilter,
    message: `What's the human readable name of module?`,
    name: 'humanModuleName',
    type: 'input'
  };

  prompts.askDescription = {
    default: generator.defaultAnswers.moduleDescription,
    filter: trimFilter,
    message: `Few words about your module`,
    name: 'moduleDescription',
    store: true,
    type: 'input'
  };

  prompts.askGHUsername = {
    default: generator.defaultAnswers.githubUsername,
    filter: trimFilter,
    message: `What's your Github username`,
    name: 'githubUsername',
    store: true,
    type: 'input'
  };

  prompts.askTestingTools = {
    default: generator.defaultAnswers.testingTools,
    message: `Which testing tool you want to setup?`,
    name: 'testingTools',
    store: true,
    type: 'list',
    choices: [
      'jest',
      'ava'
    ]
  };

  // prompts.askGitRemote = {
  //   default: session => session.githubUsername && `https://github.com/${session.githubUsername}/${session.moduleName}`,
  //   filter: trimFilter,
  //   message: `Git remote url`,
  //   name: 'gitRemote',
  //   type: 'input'
  // };

  prompts.ALL = [
    prompts.askName,
    prompts.askEmail,
    prompts.askSite,
    prompts.askModuleName,
    prompts.askCamelModuleName,
    prompts.askHumanModuleName,
    prompts.askDescription,
    prompts.askGHUsername,
    prompts.askTestingTools
    // prompts.askGitRemote
  ];

  return prompts;
};


