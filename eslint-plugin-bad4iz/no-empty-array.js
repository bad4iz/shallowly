// копия upstream no-empty-array.js
const jsdocRegex = /(?<=@(param|returns)[^{]*\{[^}]*?)\[.*?\](?!:)[^}]*?\}/;

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  create(context) {
    return {
      Program() {
        const comments = context.sourceCode.getAllComments();
        comments?.forEach((comment_) => {
          const comment = comment_.value.trim();
          const lines = comment.split('\n');
          lines.forEach((line, index) => {
            const match = jsdocRegex.exec(line);
            if (match) {
              context.report({
                node: comment_,
                message:
                  '💩 [] не допускаются в комментариях к JSDoc, используй Array',
                loc: {
                  start: {
                    line: comment_.loc.start.line + index,
                    column: match.index,
                  },
                  end: {
                    line: comment_.loc.start.line + index,
                    column: match.index + match[0].length,
                  },
                },
              });
            }
          });
        });
      },
    };
  },
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow [] in JSDoc',
      recommended: true,
      category: 'Best Practices',
    },
    schema: [],
  },
};
