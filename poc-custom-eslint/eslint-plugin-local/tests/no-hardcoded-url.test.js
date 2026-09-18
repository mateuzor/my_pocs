import { RuleTester } from 'eslint';
import { describe, it } from 'node:test';
import rule from '../rules/no-hardcoded-url.js';

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { ecmaVersion: 2023, sourceType: 'module' } });

tester.run('no-hardcoded-url', rule, {
  valid: [
    'const a = process.env.API_URL;',
    'const a = "http://localhost:3000";', // local dev is allowed
    'const a = "not a url";',
  ],
  invalid: [
    {
      code: 'fetch("https://api.example.com/users");',
      // `output` is what --fix must produce; omitting it asserts "no fix".
      output: 'fetch(process.env.URL_API_EXAMPLE_COM);',
      errors: [{ messageId: 'hardcoded', data: { url: 'https://api.example.com/users' } }],
    },
  ],
});
