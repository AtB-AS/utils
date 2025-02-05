module.exports = {
  env: {
    es6: true,
  },
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  ignorePatterns: ['.eslintrc.js'],
  extends: [
    // Add the default prettier eslint rules, respecting the settings in .prettierrc.js
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unused-imports', 'import'],
  rules: {
    // Warning on console.log
    'no-console': [1, {allow: ['warn', 'error']}],

    // Error on fallthrough in switch statements
    'no-fallthrough': 2,

    // Error on using var, e.g. 'var name = "John"'
    'no-var': 2,

    // Error on using let for variable declaration that could be const
    'prefer-const': 2,

    // Error on 'export default'
    'no-restricted-exports': [
      'error',
      {restrictDefaultExports: {direct: true}},
    ],

    // Error on unused imports
    'unused-imports/no-unused-imports': 2,

    // Error on unused variables, except those starting with underscore
    'unused-imports/no-unused-vars': [
      2,
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
