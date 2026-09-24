/** @type {import('jest').Config} */
module.exports = {
  // WHY: ts-jest compiles TS on the fly and type-checks tests, so a wrong mock signature fails the run.
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.ts'],
  // WHY: thresholds turn coverage into a gate: CI fails if it drops below these numbers.
  coverageThreshold: {
    global: { branches: 85, functions: 90, lines: 90, statements: 90 },
  },
  // WHY: restores mock call history between tests so they stay independent.
  clearMocks: true,
};
