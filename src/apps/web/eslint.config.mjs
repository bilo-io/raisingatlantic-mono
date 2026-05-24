// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * Minimal lint config for the Next.js web app.
 *
 * Background: Next.js 16 removed `next lint`, so the legacy
 * `"lint": "next lint"` script in package.json no longer works. This config
 * gives `eslint .` (the moon `web:lint` task) something to run against.
 *
 * It only lints the test scaffolding and the API client layer (`src/lib/api/**`,
 * `test/**`, `vitest.config.ts`) — the rest of the app has accumulated debt
 * that should be cleaned up in a dedicated follow-up PR rather than gating
 * this one.
 */
export default tseslint.config(
  {
    // Lint only the test infrastructure + API client layer for now.
    files: [
      'src/lib/api/**/*.{ts,tsx}',
      'test/**/*.{ts,tsx}',
      'vitest.config.ts',
    ],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    // Everything else is ignored for now — we don't want to gate this PR on
    // years of pre-existing component debt.
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'public/**',
      'next-env.d.ts',
      // Explicitly skip the rest of src/ until the dedicated cleanup PR.
      'src/app/**',
      'src/components/**',
      'src/data/**',
      'src/hooks/**',
      'src/i18n/**',
      'src/services/**',
      'src/styles/**',
      'src/types/**',
      'src/ai/**',
      'src/lib/!(api)/**',
    ],
  },
);
