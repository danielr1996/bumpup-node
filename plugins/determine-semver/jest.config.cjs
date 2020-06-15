module.exports = {
  setupFilesAfterEnv: ["jest-chain"],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
};
