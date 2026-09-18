import noMagicTimeout from './rules/no-magic-timeout.js';
import noHardcodedUrl from './rules/no-hardcoded-url.js';

// A plugin is just { meta, rules }. The "meta" helps ESLint cache and debug.
export default {
  meta: { name: 'eslint-plugin-local', version: '0.0.1' },
  rules: {
    'no-magic-timeout': noMagicTimeout,
    'no-hardcoded-url': noHardcodedUrl,
  },
};
