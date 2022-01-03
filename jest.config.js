module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  // coverageProvider: 'v8',
  // testEnvironment: 'jest-environment-node',
  // testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
