#!/usr/bin/env node
const gitFig = require('gitfig');
const inquirer = require('inquirer');
const path = require('path');
const addCounter = require('inquirer-questions-counter');
const installScript = require('./install');

// TODO temporary storage where the latest answers (like site or name (if they don't same as the defaults), but not
// modulename) is saved

function findInConfigKey(key, defaultVal = null) {
  let result = defaultVal;

  try {
    result = gitFig.sync(gitFig.LOCAL)[key];
  } catch (e) {
    try {
      result = gitFig.sync(gitFig.HOME)[key];
    } catch (e) {
      // go ahead
    }
  }

  return result;
}

function camelize(str) {
  return str
    .trim()
    // find every letter followed after the -, _ or space character and uppercases it
    .replace(/[-_\s]+(.)?/g, (match, c) => c ? c.toUpperCase() : '');
}

function humanize(str) {
  return str
    .trim()
    // find every letter followed after the -, _ or space character and uppercases it
    .split(/[-_\s]+/)
    .map(txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
    .join(' ');
}

const askName = {
  type: 'input',
  name: 'name',
  message: `What's author's name?`,
  default: (findInConfigKey('user') || {}).name
};

const askEmail = {
  type: 'input',
  name: 'email',
  message: `What's author's email?`,
  default: (findInConfigKey('user') || {}).email
};

const askSite = {
  type: 'input',
  name: 'site',
  message: `What's the author's web site?`
};

const askModuleName = {
  type: 'input',
  name: 'moduleName',
  message: `What's the module name?`,
  default: path.basename(process.cwd())
};

const askCamelModuleName = {
  type: 'input',
  name: 'camelModuleName',
  message: `How to spell module name in camelCase?`,
  default: session => camelize(session.moduleName)
};

// TODO now is not used
const askHumanModuleName = {
  type: 'input',
  name: 'humanModuleName',
  message: `What's the human readable name of module?`,
  default: session => humanize(session.moduleName)
};

const askDescription = {
  type: 'input',
  name: 'description',
  message: `Few words about your module`,
};

const askGHUsername = {
  type: 'input',
  name: 'userName',
  message: `Username at GitHub.com`,
};

const askPkgManager = {
  type: 'list',
  name: 'userName',
  message: `Do you have yarn installed globally`,
  choices: ['npm', 'yarn'],
  default: 0
};

// TODO human readable module name

const allQuestions = [
  askPkgManager,
  askName,
  askEmail,
  askSite,
  askModuleName,
  askCamelModuleName,
  askHumanModuleName,
  askDescription,
  askGHUsername
];

inquirer.prompt(addCounter(allQuestions)).then(answers => {
  console.log(JSON.stringify(answers, null, '  '));

  installScript({
    name: answers.name,
    email: answers.email,
    website: answers.site,

    moduleName: answers.moduleName,
    camelModuleName: answers.camelModuleName,
    moduleDescription: answers.description,
    githubUsername: answers.userName,
  });
});
