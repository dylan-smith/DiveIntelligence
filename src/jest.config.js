/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/e2e/',
  ],
  collectCoverageFrom: [
    'src/services/**/*.{ts,tsx}',
    'src/utils/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
  ],
  coverageDirectory: 'test-results/unit-tests/code-coverage',
  coverageReporters: [
    'text',
    'lcov',
    ['cobertura', { file: 'cobertura/cobertura-coverage.xml' }],
  ],
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results/unit-tests',
      outputName: 'junit.xml',
    }],
  ],
};

module.exports = config;
