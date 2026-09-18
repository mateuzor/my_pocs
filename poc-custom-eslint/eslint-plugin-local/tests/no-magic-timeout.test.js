import { RuleTester } from 'eslint';
import { describe, it } from 'node:test';
import rule from '../rules/no-magic-timeout.js';

// WHY: RuleTester looks for global describe/it; with node:test we wire them explicitly.
RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { ecmaVersion: 2023, sourceType: 'module' } });

// WHY: valid/invalid arrays are the whole contract of a rule: what it must allow and what it must flag.
tester.run('no-magic-timeout', rule, {
  valid: [
    'const WAIT = 500; setTimeout(fn, WAIT);',
    'setTimeout(fn);',
    { code: 'setTimeout(fn, 0);', options: [{ allowed: [0] }] },
    'obj.setTimeout(fn, 1000);', // member calls are out of scope
  ],
  invalid: [
    {
      code: 'setTimeout(fn, 1000);',
      errors: [
        {
          messageId: 'magic',
          data: { value: '1000' },
          // Suggestions are asserted with their output, like fixes.
          suggestions: [
            { messageId: 'extract', data: { value: '1000' }, output: 'setTimeout(fn, DELAY_1000_MS /* TODO: declare */);' },
          ],
        },
      ],
    },
    {
      code: 'setInterval(fn, 250);',
      options: [{ allowed: [0] }],
      errors: [
        {
          messageId: 'magic',
          data: { value: '250' },
          suggestions: [
            { messageId: 'extract', data: { value: '250' }, output: 'setInterval(fn, DELAY_250_MS /* TODO: declare */);' },
          ],
        },
      ],
    },
  ],
});
