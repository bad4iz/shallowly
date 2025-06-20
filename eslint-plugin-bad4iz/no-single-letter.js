// копия upstream no-single-letter.js
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      Identifier(node) {
        if (node.name.length === 1 && node.name !== '_') {
          context.report({
            node,
            message: '💩 Избегайте однобуквенных идентификаторов !!!',
          });
        }
      },
    };
  },
};
