// Rule 1: setTimeout/setInterval with a bare number literal.
// Demonstrates: CallExpression visitor, options + schema, messageId, suggestions.

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow numeric literals as timer delays; use a named constant' },
    // WHY: hasSuggestions must be declared, otherwise ESLint throws when a rule reports suggestions.
    hasSuggestions: true,
    // WHY: a JSON schema validates user options, so typos in config fail fast.
    schema: [
      {
        type: 'object',
        properties: { allowed: { type: 'array', items: { type: 'number' } } },
        additionalProperties: false,
      },
    ],
    // WHY: messageIds keep text out of the logic and make tests assert on ids, not strings.
    messages: {
      magic: 'Avoid magic delay {{value}}. Extract it into a named constant.',
      extract: 'Extract {{value}} into a constant.',
    },
  },

  create(context) {
    const allowed = new Set(context.options[0]?.allowed ?? []);

    return {
      // WHY: we visit only the AST node type we care about - cheap and precise.
      CallExpression(node) {
        const { callee } = node;
        if (callee.type !== 'Identifier') return;
        if (callee.name !== 'setTimeout' && callee.name !== 'setInterval') return;

        const delay = node.arguments[1];
        if (!delay || delay.type !== 'Literal' || typeof delay.value !== 'number') return;
        if (allowed.has(delay.value)) return;

        context.report({
          node: delay,
          messageId: 'magic',
          data: { value: String(delay.value) },
          suggest: [
            {
              messageId: 'extract',
              data: { value: String(delay.value) },
              // WHY: a suggestion (not an autofix) because naming the constant needs human intent.
              fix: (fixer) => fixer.replaceText(delay, `DELAY_${delay.value}_MS /* TODO: declare */`),
            },
          ],
        });
      },
    };
  },
};
