import js from '@eslint/js';
import globals from 'globals';
import local from './eslint-plugin-local/index.js';

// Flat config: an array of config objects, applied in order.
// Later objects override earlier ones for the files they match.
export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: globals.node },

    // WHY: plugins are plain objects in flat config - no string resolution
    // ("eslint-plugin-xyz" lookup) like the old .eslintrc. A local plugin is just an import.
    plugins: { local },

    rules: {
      'local/no-magic-timeout': ['error', { allowed: [0] }],
      'local/no-hardcoded-url': 'warn',
    },
  },
  {
    // Scope tests to relax rules: config objects can target different globs.
    files: ['eslint-plugin-local/tests/**'],
    rules: { 'local/no-hardcoded-url': 'off' },
  },
];
