const path = require('path');
const utils = require('./utils');

module.exports = (generator) => {
  const prompts = {};

  prompts.askName = {
    type: 'input',
    name: 'name',
    message: `What's your name?`,
    default: generator.defaultAnswers.name,
    store: true
  };

  prompts.askEmail = {
    type: 'input',
    name: 'email',
    message: `What's your email?`,
    default: generator.defaultAnswers.email,
    store: true
  };

  prompts.askSite = {
    type: 'input',
    name: 'website',
    message: `What's your web site?`,
    default: generator.defaultAnswers.website,
    store: true
  };

  prompts.askModuleName = {
    type: 'input',
    name: 'moduleName',
    message: `What's the module name?`,
    default: generator.defaultAnswers.moduleName
  };

  prompts.askCamelModuleName = {
    type: 'input',
    name: 'camelModuleName',
    message: `What's a camelCase for module name?`,
    default: session => utils.camelize(session.moduleName)
  };

  // TODO now is not used, put somewhere in README.md
  prompts.askHumanModuleName = {
    type: 'input',
    name: 'humanModuleName',
    message: `What's the human readable name of module?`,
    default: session => utils.humanize(session.moduleName)
  };

  prompts.askDescription = {
    type: 'input',
    name: 'moduleDescription',
    message: `Few words about your module`,
    default: generator.defaultAnswers.moduleDescription
  };

  prompts.askGHUsername = {
    type: 'input',
    name: 'githubUsername',
    message: `What's your Github username`,
    default: generator.defaultAnswers.githubUsername,
    store: true
  };

  prompts.ALL = [
    prompts.askName,
    prompts.askEmail,
    prompts.askSite,
    prompts.askModuleName,
    prompts.askCamelModuleName,
    prompts.askHumanModuleName,
    prompts.askDescription,
    prompts.askGHUsername
  ];

  return prompts;
};


