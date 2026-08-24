import eslintComments from '@eslint-community/eslint-plugin-eslint-comments'
import noOnlyTests from 'eslint-plugin-no-only-tests'
import tseslint from 'typescript-eslint'

const plugins = {
  'eslint-comments': eslintComments,
  'no-only-tests': noOnlyTests,
}

const rules = {
  'prefer-const': 'warn',
  'no-console': 'warn',
  'no-debugger': 'warn',
  'no-only-tests/no-only-tests': 'warn',
  'eslint-comments/no-unused-disable': 'warn',
}

const typedRules = {
  '@typescript-eslint/no-unused-vars': [
    'warn',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
  '@typescript-eslint/no-unnecessary-condition': 'warn',
  '@typescript-eslint/no-useless-empty-export': 'warn',
}

export default tseslint.config(
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/dev/**', 'test-results/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.base],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins,
    rules: { ...rules, ...typedRules },
  },
  {
    files: ['**/*.{js,jsx,mjs}'],
    plugins,
    rules,
  },
  {
    files: ['**/*.config.{ts,mjs}', 'cmdk-solid/scripts/**'],
    rules: { 'no-console': 'off' },
  },
)
