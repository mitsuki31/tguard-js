const { cpus } = require('node:os');

/** @type {import('jest').Config} */
module.exports = {
  cache: true,
  collectCoverage: false,
  coverageReporters: ['text', 'lcov', 'json'],
  maxWorkers: cpus().length || 1,
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  verbose: true,
};
