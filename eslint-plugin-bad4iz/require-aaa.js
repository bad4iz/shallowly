// копия upstream require-aaa.js
module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Enforce ☣️ Arrange/🔥 Act/❓ Assert comments in test blocks',
      recommended: false,
      category: 'Best Practices',
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    const required = {
      arrange: { emoji: '☣️', text: 'Arrange (всякие моки)' },
      act: { emoji: '🔥', text: 'Act' },
      assert: { emoji: '❓', text: 'Assert' },
    };
    return {
      'CallExpression[callee.name="it"]'(node) {
        const body = node.arguments[1]?.body?.body;
        if (!body) return;
        const comments = sourceCode.getAllComments().filter((c) => node.range[0] < c.range[0] && c.range[1] < node.range[1]);
        const patterns = { arrange: /arrange/i, act: /act/i, assert: /assert/i };
        const found = { arrange: null, act: null, assert: null };
        comments.forEach((c) => {
          const txt = c.value.trim();
          Object.entries(patterns).forEach(([k, p]) => { if (p.test(txt)) found[k] = c; });
        });
        Object.entries(required).forEach(([k, cfg]) => {
          const expected = `//${cfg.emoji} ${cfg.text}`;
          if (!found[k]) {
            context.report({ node, message: `Missing ${cfg.emoji} ${cfg.text} comment`, fix(fixer) {
              if (k === 'assert') {
                const expectNode = body.find((n) => n.type === 'ExpressionStatement' && n.expression.type === 'CallExpression' && n.expression.callee.name === 'expect');
                if (expectNode) return fixer.insertTextBefore(expectNode, `${expected}\n`);
                return fixer.insertTextBefore(body[body.length - 1], `${expected}\n`);
              }
              return fixer.insertTextBefore(body[0], `${expected}\n`);
            }});
          } else {
            const existing = sourceCode.getText(found[k]);
            if (!existing.startsWith(`//${cfg.emoji}`)) {
              context.report({ node: found[k], message: `Invalid format for ${cfg.text} comment`, fix: (fixer) => fixer.replaceText(found[k], expected) });
            }
          }
        });
      },
    };
  },
};
