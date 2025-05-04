import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

// https://typescript-eslint.io/getting-started
export default defineConfig([
  // Base configurations
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Global ignores (most efficient)
  {
    ignores: [
      './src/__tests__/**', // Ignore test files
      'dist/**', // Ignore entire dist folder
      'coverage/**', // Test coverage
      '**/*.d.ts', // TypeScript declaration files
      'node_modules/**', // Already ignored by default, but explicit is better
    ],
  },

  // Your rules and overrides
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // Your custom rules here
    },
  },
])
