require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: 'facile',
  parserOptions: { project: './tsconfig.json' },
  rules: {
    '@typescript-eslint/no-shadow': 'off',
    'import/order': [
      'error',
      {
        alphabetize: { caseInsensitive: true },
        groups: [['builtin', 'external'], 'index', 'parent', 'sibling'],
      },
    ],
  },
}
