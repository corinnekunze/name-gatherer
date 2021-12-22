module.exports = {
  rootDir: '.',
  setupFiles: ['<rootDir>/spec/utils/setupTests.ts'],
  testMatch: ['<rootDir>/**/*.(test|spec).(j|t)s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/__mocks__/',  '/dist/'],
  collectCoverageFrom: ['**/*.ts?(x)'],
  coveragePathIgnorePatterns: ['index.js', 'test'],
  // Ignore npm caching to avoid problems with jest and chalk throwing errors
  // when running in grand central. Fix grabbed from this github issue:
  // https://github.com/facebook/jest/issues/4682#issuecomment-352899677
  modulePathIgnorePatterns: ['npm-cache', '.npm'],
  preset: 'ts-jest/presets/js-with-babel',
  moduleNameMapper: {
    '\\.(scss|css)$': '<rootDir>/spec/utils/mocks/styleMock.jsx',
  },
  resetMocks: true,
};
