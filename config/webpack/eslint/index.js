baseConfig = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true
  },
  'extends': [
    'standard',
    'standard-react'
  ],
  'plugins': [
    'babel',
    'react',
    'promise'
  ],
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'react/prop-types': 0,
    'padded-blocks': 0,
    'no-unused-expressions': ['error', {
      'allowShortCircuit': true,
      'allowTernary': true
    }],
    'import/no-webpack-loader-syntax': 0,
    
  }
}

finalConfig = (customConfig = {}, isDebug) => ({
  ...baseConfig,
  ...{
    'no-debugger': isDebug ? 0 : 2
  },
  ...customConfig
})


module.exports = finalConfig
