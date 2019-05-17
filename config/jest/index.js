const baseConfig = {
  transform: {
    '^.+\\.css$': require.resolve('./transform/css.js'),
    '^.+\\.(js|jsx|mjs)$': require.resolve('./transform/babel.js'),
    '^(?!.*\\.(js|jsx|mjs|css|json)$)': require.resolve('./transform/file.js'),
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx,mjs}'],
  coverageDirectory: '<rootDir>/report/coverage',
  setupFiles: [require.resolve('@babel/polyfill')],
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.(ts|tsx|js)',
  ],
  testEnvironment: 'node',
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$'],
  moduleFileExtensions: [
    'web.js',
    'js',
    'json',
    'web.jsx',
    'jsx',
    'node',
    'mjs',
  ],
};

const finalConfig = (customConfig = {}) => ({
  ...baseConfig,
  ...customConfig,
});

module.exports = finalConfig;
