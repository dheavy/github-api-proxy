/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1"
  },
  testMatch: [
    "**/?(*.)+(spec|test).[t]s?(x)"
  ]
};
