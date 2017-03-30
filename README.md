Modern, ready to use, setup-free ES6 module boilerplate for browser.
 
### Features
* `ES6` code anywhere: sources, tests, configs
* Transpilation with `babel`
* Bundling with `webpack 2`
* Unit tests with `ava` (think about jasmine)
* `npm` as task runner
* Linting with `XO`
* Continuous integration with `Travis`
* Code coverage and online reports via `codecov.io`
* Dependencies info by `David`
* [Yarn](https://yarnpkg.com/en/) support

## Install

TBD

## Integration with 3rd party services

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
