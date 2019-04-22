module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
  },
  plugins: [
    'babel',
    'react',
    'promise',
    'react-hooks',
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'prettier',
    'prettier/react',
  ],
  rules: {
    'prettier/prettier': 'warn',
  },
};
