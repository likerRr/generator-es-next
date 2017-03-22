const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const detectInstalled = require('detect-installed');
const pMap = require('p-map');
const pFilter = require('p-filter');
const which = require('which');
const execSeries = require('exec-series');

// ----------------- Configuration area --------------------

const defaultPlaceholders = {
  name: '',
  email: '',
  website: '',

  moduleName: '',
  camelModuleName: '',
  moduleDescription: '',
  githubUsername: '',
};
const cwd = path.resolve(process.cwd(), 'test');

const MODULE_TYPE = {
  BROWSER: 'browser',
  NODE: 'node'
};
const defaultModuleType = MODULE_TYPE.BROWSER;

// ---------------------------------------------------------

function getModulePath(moduleType = defaultModuleType) {
  return path.resolve(__dirname, moduleType);
}

function resolveOriginPath(file, moduleType = defaultModuleType) {
  return path.resolve(getModulePath(moduleType), file);
}

function resolveDestinationPath(file) {
  return path.resolve(cwd, file);
}

/**
 *
 * @param options
 * @return {Promise}
 */
module.exports = options => {
  const placeholders = Object.assign({}, defaultPlaceholders, options);
  const moduleType = defaultModuleType;
  const files = {
    license: resolveDestinationPath('LICENSE'),
    package: resolveDestinationPath('package.json'),
    readme: resolveDestinationPath('README.md'),
    install: __filename
  };

  const folders = {
    backup: resolveDestinationPath(`.backup${Date.now()}`)
  };

  return Promise.resolve()
    .then(() => makeBackup(cwd))
    .then(() => copyModule(moduleType))
    .then(() => Promise.all([
      replaceIn(files.license),
      replaceIn(files.package),
      replaceIn(files.readme)
    ]))
    .then(() => installDependencies())
    .then(() => initGit())
    .then(() => runTests());

  function copy(from, to) {
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(to);

      writer.on('finish', () => resolve());
      writer.on('error', err => reject(err));

      const reader = fs.createReadStream(from);

      reader.on('error', err => reject(err));
      reader.pipe(writer);
    });
  }

  function copyModule(moduleType = defaultModuleType) {
    const modulePath = getModulePath(moduleType);

    return getFilesInDir(modulePath)
      .then(files => {
        return Promise.all(files.map(file => {
          return copy(resolveOriginPath(file, moduleType), resolveDestinationPath(file));
        }));
      });
  }

  function getFilesInDir(dirname) {
    return new Promise((resolve, reject) => {
      fs.readdir(dirname, (err, items) => {
        if (err) return reject(err);

        resolve(items);
      });
    });
  }

  function fsStat(file) {
    return new Promise((resolve, reject) => {
      fs.stat(file, (err, stats) => {
        if (err) return reject(err);

        resolve(stats);
      });
    });
  }

  function makeBackup(dirname) {
    return getFilesInDir(dirname)
      .then(fileNames => {
        // TODO temporary solution because `copy` function can't recreate directory structure
        return pFilter(fileNames, file => {
          return fsStat(file)
            .then(stats => stats.isFile() ? file : null)
            .catch(Function.prototype);
        });
      })
      .then(fileNames => {
        if (fileNames.length > 0) {
          if (!fs.existsSync(folders.backup)) fs.mkdirSync(folders.backup, 755);

          const withoutPreviousBackup = fileNames => fileNames.filter(file => !/^\.backup\d+/.test(file));

          // don't copy previous backup folders
          fileNames = withoutPreviousBackup(fileNames);

          return Promise.resolve(fileNames)
            .then(fileNames => pMap(fileNames, file => {
              return copy(path.resolve(dirname, file), path.join(folders.backup, file))
                .then(() => file);
            }));
        }
      });
  }

  function replaceIn(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, fileContent) => {
        if (err) return reject(err);

        // regexp to find all template groups to replace
        const regExp = new RegExp('<%=\\s([a-zA-Z0-9]+)\\s%>', 'g');
        const res = fileContent.replace(regExp, (match, group) => placeholders[group]);

        fs.writeFile(filePath, res, 'utf8', err => {
          if (err) return reject(err);

          resolve(res);
        });
      });
    });
  }

  // TODO handle exit?
  function installDependencies() {
    process.chdir(cwd);
    // TODO dont install dependencies if NODE_ENV = development, but can be forced with flag --force (-f)
    const pkgManager = detectInstalled('yarn') ? 'yarn' : 'npm';
    const ls = spawn(pkgManager, ['install'], {
      shell: true
    });

    ls.stdout.on('data', data => console.log(`⌵ ${data}`));
    ls.stderr.on('data', data => console.log(`⨯ ${data}`));

    ls.on('close', code => console.log(`child process exited with code ${code}`));
    ls.on('error', err => {
      throw err;
    });
  }

  // TODO handle exit?
  function initGit() {
    which('git', err => {
      if (!err) {
        process.chdir(cwd);

        execSeries(['git init', 'git add .', 'git commit -m Initial'], (err, stdouts, stderrs) => {
          if (err) {
            throw err;
          }

          stdouts
            .filter(v => v)
            .forEach(out => console.log(out));

          stderrs
            .filter(v => v)
            .forEach(err => console.error(err));
        });

        // TODO if remote repository is set and available, do push initial commit
      }
    })
  }

  function runTests() {
    const ls = spawn('npm', ['test'], {
      shell: true
    });

    ls.stdout.on('data', data => console.log(`⌵ ${data}`));
    ls.stderr.on('data', data => console.log(`⨯ ${data}`));

    ls.on('close', code => console.log(`child process exited with code ${code}`));
    ls.on('error', err => {
      throw err;
    });
  }
};
