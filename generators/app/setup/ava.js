const packageJson = {
  "ava": {
    "require": [
      "babel-register"
    ]
  },
  "devDependencies": {
    // TODO dependencies and it's versions must be placed in separate file in order to use across the generator
    "ava": "^0.18.2",
    "nyc": "^10.1.2"
  },
  "scripts": {
    "test": "ava",
    "test:watch": "npm run test -- -watch",
    "coverage": "nyc report --reporter=text-lcov", // Displays coverage info
    "coverage:collect": "nyc ava" // Runs tests and collects coverage info
  },
  "nyc": {
    "include": [
      // TODO the name should be synchronized with generated template file name(s)
      "test.js"
    ],
    "reporter": [
      "lcov",
      "text"
    ],
    "lines": 100,
    "statements": 100,
    "functions": 100,
    "branches": 100,
    "check-coverage": true,
    "sourceMap": false,
    "instrument": false
  }
};

const test = `import test from 'ava';
import fn from './index';

test('title', t => {
  t.is(fn('es-next'), 'Hello from es-next');
});
`;

module.exports = {packageJson, test};
