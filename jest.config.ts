module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts',
    '!src/**/*.interface.ts',
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.js?$': 'ts-jest',
  },
};
