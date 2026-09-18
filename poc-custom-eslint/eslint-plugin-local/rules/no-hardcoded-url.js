// Rule 2: hardcoded http(s) URLs in string literals, with an AUTOFIX.
// Demonstrates: fixable rules, template literals, scope-free pattern matching.

const URL_RE = /^https?:\/\/(?!localhost)/i;

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow hardcoded remote URLs; read them from config/env' },
    // WHY: "fixable" opts the rule into `eslint --fix`; without it the fixer is rejected.
    fixable: 'code',
    schema: [],
    messages: {
      hardcoded: 'Hardcoded URL "{{url}}". Read it from process.env or config.',
    },
  },

  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== 'string' || !URL_RE.test(node.value)) return;

        context.report({
          node,
          messageId: 'hardcoded',
          data: { url: node.value },
          // WHY: the fix must be safe and deterministic. Here we only rewrite
          // when the URL is the whole literal, turning it into an env lookup.
          fix(fixer) {
            const host = new URL(node.value).host.replace(/[^a-z0-9]/gi, '_').toUpperCase();
            return fixer.replaceText(node, `process.env.URL_${host}`);
          },
        });
      },
    };
  },
};
