const packageJson = {
  jest: {
    // "testEnvironment": "node", // TODO setupable
    // "testMatch": [
    //   "**/__tests__/*.js"
    // ]
    coverageReporters: [
      'lcov',
      'text'
    ],
    coverageThreshold: {
      global: {
        lines: 100,
        statements: 100,
        functions: 100,
        branches: 100
      }
    }
  },
  devDependencies: {
    // TODO dependencies and it's versions must be placed in separate file in order to use across the generator
    jest: '^19.0.2'
  },
  scripts: {
    test: 'jest',
    'test:watch': 'npm run test -- --watch',
    coverage: 'npm run test -- --coverage', // Displays coverage info from collected coverage
    'coverage:collect': 'npm run coverage' // Runs tests and collects coverage info
  }
};

const test = `import fn from './index';

test('title', () => {
  expect(fn('es-next')).toBe('Hello from es-next');
});
`;

module.exports = {packageJson, test};
