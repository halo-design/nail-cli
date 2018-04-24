module.exports = jestConfig => {
  jestConfig = jestConfig || {}

  let defaultConfig = {
    transform: {
      '^.+\\.(js|jsx|mjs)$': require.resolve('./jest/babelTransform.js'),
      '^.+\\.css$': require.resolve('./jest/cssTransform.js'),
      '^(?!.*\\.(js|jsx|mjs|css|json)$)': require.resolve('./jest/fileTransform.js')
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverageFrom: ['src/**/*.{js,jsx,mjs}'],
    setupFiles: [require.resolve('@babel/polyfill')],
    testMatch: [
      '<rootDir>/(tests/unit/**/*.spec.(ts|tsx|js)|**/__tests__/*.(ts|tsx|js))'
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
      'mjs'
    ]
  }

  return {
    ...defaultConfig,
    ...jestConfig
  }
}
