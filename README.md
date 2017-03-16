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

Clone and setup repository first

```bash
$ git clone https://github.com/likerRr/es6-module-boilerplate your_module_name
$ cd your_module_name
$ rm -rf .git
$ git init
$ git remote add origin https://github.com/your_name/your_module_name
```

Fill in configuration fields in `install` and run:

```bash
# for linux users
  $ ./install

# for others
  $ node install

# finalize first run
  $ npm test
  $ git add .
  $ git commit -m "initial"
  # if remote branch exists then get it and track it
    $ git fetch
    $ git branch -u origin/master
  # $ git push
  # if remote branch does NOT exist then specify it with the first push
  # $ git push -u origin master
```

```javascript
// example config
const settings = {
  name: 'Alexey Lizurchik',
  email: 'al.lizurchik@gmail.com',
  website: 'http://likerrr.ru',

  moduleName: 'my-module',
  camelModuleName: 'myModule',
  moduleDescription: 'Very nice module',
  githubUsername: 'likerRr',
};
```
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
