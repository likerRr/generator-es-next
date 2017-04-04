[![Build Status](https://img.shields.io/travis/likerRr/generator-es-next/master.svg)](https://travis-ci.org/likerRr/generator-es-next)

Modern, ready to use, setup-free ES6 (and above) module generator for browsers and node *(in development)*.
 
### Features
* `ES6` code anywhere: sources, tests, configs
* Transpilation with `babel`
* Bundling with `webpack 2`
* Unit tests with `ava`
* `npm` as a task runner
* Linting with `XO`
* Continuous integration with `Travis`
* Code coverage and online reports via `codecov.io`
* Dependencies info by `David`
* [Yarn](https://yarnpkg.com/en/) support

## Install

The boilerplate is a [yeoman](http://yeoman.io) generator, what means you need install it at first and then the 
boilerplate itself:

```bash
npm i -g yo
npm i -g generator-es-next
```

To run boilerplate simply run it in the empty folder.

```bash
mkdir example-module && cd example-module
yo es-next
```

Then you have to answer several questions and the app will be generated.

To review all the available options, run the generator with `-h` flag:

```bash
yo es-next -h
```

## Integration with 3rd party services

Generated app is set up to work with several 3rd party service. You just need to authorize your app on them. Read below
for further instructions.

### Travis

Travis is a continuous integration service that manages building and testing your app automatically by handling git 
hooks.

#### Setup

Visit [travis](http://travis-ci.org) and authorize your app. From this point travis starts watching your pushes/PRs.

### David

Helps keeping dependencies of your app up to date.

#### Setup

Is not needed. Just visit https://david-dm.org/githubName/appName for info about dependencies.

### Codecov

Service that creates code coverage reports and provides statistics for your app.

#### Setup

Go to [codecov](https://codecov.io) and authorize your app. Now after every travis build a report will be created.

In order to use  reports manually (without help of travis), use `npm run coverage` to generate report 
and `npm run coverage:report -- -t :repository-token` to upload it. Find `:repository-token` on the project's 
page at [codecov](https://codecov.io).
