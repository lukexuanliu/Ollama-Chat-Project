export default {
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.m?js$': ['babel-jest', { presets: ['@babel/preset-env'] }]
  },
  transformIgnorePatterns: ['node_modules/(?!(@babel/preset-env))']
};
