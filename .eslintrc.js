module.exports = {
  env: {
    node: true,
    browser: true,
    es2017: true,
    'jest/globals': true,
  },
  globals: {
    $: 'readonly', // there's probably a reason why jQuery plugin doesn't automatically do this
  },
  plugins: ['prettier', 'promise', 'import', 'node', 'compat', 'jest', 'jquery'],
  extends: ['eslint:recommended', 'plugin:jquery/deprecated', 'google', 'prettier'],
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
