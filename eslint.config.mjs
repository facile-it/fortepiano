import { defineConfig } from 'eslint/config'
import facile from 'eslint-config-facile'

export default defineConfig([
  {
    ignores: ['**/*.{js,cjs,mjs}', 'coverage/**', 'dist/**'],
  },
  facile,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      // The shared config also enables the Node resolver, which prefers fp-ts's
      // empty es6 builds for type-only modules. Use the TypeScript resolver so
      // those imports are checked against the declaration files.
      'import/resolver': 'typescript',
    },
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
  },
])
