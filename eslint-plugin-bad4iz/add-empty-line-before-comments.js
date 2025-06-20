/* copied from upstream */

/**
 * ESLint правило для добавления пустой строки перед комментариями, содержащими определённые ключевые слова.
 */
module.exports = {
  create(context) {
    const keywords = ['clear mock', 'act', 'assert'];
    return {
      Program() {
        const sourceCode = context.getSourceCode();
        const lines = sourceCode.getLines();
        lines.forEach((line, lineIndex) => {
          if (line.trim().startsWith('//')) {
            const commentText = line.toLowerCase();
            const containsKeyword = keywords.find((keyword) =>
              commentText.includes(keyword),
            );
            if (containsKeyword) {
              const previousLine = lines[lineIndex - 1];
              if (previousLine && previousLine.trim() !== '') {
                context.report({
                  loc: {
                    start: { line: lineIndex + 1, column: 0 },
                    end: { line: lineIndex + 1, column: line.length },
                  },
                  message: `🤬 Перед ${containsKeyword} должна быть пустая строка`,
                  fix(fixer) {
                    return fixer.insertTextBeforeRange([
                      sourceCode.getIndexFromLoc({ line: lineIndex + 1, column: 0 }),
                      0,
                    ], '\n');
                  },
                });
              }
            }
          }
        });
      },
    };
  },
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    docs: {
      description: 'Добавляет пустую строку перед комментариями с ключевыми словами',
      category: 'Stylistic Issues',
      recommended: false,
    },
    schema: [],
  },
};
