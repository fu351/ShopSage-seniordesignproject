module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '^.+\\.jsx?$': 'babel-jest', // Add this line to handle ES modules
      "^.+\\.mjs$": "babel-jest" // Add this line to handle .mjs files
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs'],
    transformIgnorePatterns: ['node_modules/(?!axios)'],
  };