const packageJson = {
  ava: {
    require: [
      'babel-register'
    ]
  },
  devDependencies: {
    ava: '^0.18.2'
  },
  scripts: {
    test: 'nyc ava',
    'test:watch': 'npm run test -- -watch'
  }
};

const test = `import test from 'ava';
import fn from './index';

test('title', t => {
  t.is(fn('unicorns'), 'Hello, unicorns');
});
`;

module.exports = {packageJson, test};
