import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: ['dist/**', 'test-results/**', 'node_modules/**', '.angular/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, reactHooks.configs['recommended-latest'], reactRefresh.configs.vite, prettierRecommended],
    languageOptions: {
      ecmaVersion: 2022,
    },
  },
  {
    // The e2e suite and playwright config were not linted by the old `ng lint` setup
    files: ['e2e/**/*.ts', 'playwright.config.ts', 'playwright.global-setup.ts', 'vite.config.ts'],
    rules: {
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
