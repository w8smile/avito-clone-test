export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/tests/**/*.ts', '**/tests/**/*.tsx'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
}
