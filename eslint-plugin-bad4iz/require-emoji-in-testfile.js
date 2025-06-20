// копия upstream require-emoji-in-testfile.js
module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Require 🐛 in describe and 🧪 in it blocks',
      recommended: false,
      category: 'Best Practices',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.name === 'describe') {
          const arg = node.arguments[0];
          if (arg && arg.type === 'Literal' && typeof arg.value === 'string' && !arg.value.includes('🐛')) {
            context.report({ node: arg, message: 'Describe block should include 🐛 emoji', fix: (fixer) => fixer.replaceText(arg, `'🐛 ${arg.value}'`) });
          }
        }
        if (node.callee.name === 'it') {
          const arg = node.arguments[0];
          if (arg && arg.type === 'Literal' && typeof arg.value === 'string' && !arg.value.includes('🧪')) {
            context.report({ node: arg, message: 'It block should include 🧪 emoji', fix: (fixer) => fixer.replaceText(arg, `'🧪 ${arg.value}'`) });
          }
        }
      },
    };
  },
};
