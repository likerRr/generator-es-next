Modern, ready to use, setup-free ES6 module boilerplate for browser.
 
### What's included?
* `ES6` code anywhere: sources, tests, configs
* Transpilation with `babel`
* Bundling with `webpack 2`
* Unit tests with `ava` (think about jasmine)
* `npm` as task runner
* Linting with `XO`
* Continuous integration with `Travis`

## Install

Fill in configuration fields in `install` and run:

```
$ git clone https://github.com/likerRr/es6-module-boilerplate your_module_name
$ cd your_module_name
$ rm -rf .git
$ git init
$ git remote add origin https://github.com/your_name/your_module_name

# for linux users
  $ ./install

# for others
  $ node install

# finallize first run
  $ npm test
  $ git add .
  $ git commit -m "initial"
  # track remote branch
  $ git branch -u origin/master
  # $ git push
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
