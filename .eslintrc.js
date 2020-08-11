module.exports = {
  env: {
    node: true,
    browser: true,
    es2017: true,
  },
  globals: {
    __basedir: 'readonly',
  },
  plugins: ['prettier', 'promise', 'import', 'node', 'compat'],
  extends: ['eslint:recommended', 'google', 'prettier'],
  rules: {
    'prettier/prettier': ['warn'],
    'no-template-curly-in-string': ['warn'],
    'prefer-template': ['warn'],
    'require-jsdoc': ['off'],
    'new-cap': ['error', {capIsNewExceptions: ['Router']}],
    'no-debugger': ['warn'],
    'vars-on-top': ['warn'],
    'brace-style': ['error', '1tbs', {allowSingleLine: true}],
    eqeqeq: ['error', 'always'],
    curly: ['error', 'multi-or-nest', 'consistent'],
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
};
