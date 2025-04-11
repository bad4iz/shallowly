// eslint.config.mjs
import jsdoc from 'eslint-plugin-jsdoc';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default [
  {
    // Базовые настройки
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'simple-import-sort': simpleImportSort,
      jsdoc,
    },
    rules: {
      // Базовые правила ESLint
      ...jsdoc.configs.recommended.rules,
      ...typescriptEslint.configs.recommended.rules,

      // Дополнительные правила можно добавить здесь
    },
  },

  // При необходимости можно добавить дополнительные конфигурационные объекты
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // TypeScript-специфичные правила
    },
  },
];
