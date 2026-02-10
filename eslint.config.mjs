import { fixupPluginRules } from '@eslint/compat';
import pluginJs from '@eslint/js';
import bad4iz from 'eslint-plugin-bad4iz';
import jsdoc from 'eslint-plugin-jsdoc';
import react from 'eslint-plugin-react';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// import { FlatCompat } from '@eslint/eslintrc';
//
// const compat = new FlatCompat({
//   allConfig: js.configs.all,
//   baseDirectory: __dirname,
//   recommendedConfig: js.configs.recommended,
// });

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  jsdoc.configs['flat/recommended'],

  {
    ignores: [
      // '**/.storybook',
      // '**/*.stories.*',
      // '**/stories/',
      // 'stories/',
      // 'stories/**',
      // 'stories',
      // '**/*.story.*',

      '**/node_modules',
      '**/build',
      '**/coverage',
      '**/public',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ...reactRecommended,
    plugins: {
      bad4iz,
      jsdoc,
      react,
      'react-hooks': fixupPluginRules(eslintPluginReactHooks),
      'simple-import-sort': simpleImportSort,
      'sort-keys-fix': sortKeysFix,
    },

    // ...compat.extends(react_app),
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          fixToUnknown: true,
        },
      ],

      'bad4iz/add-empty-line-before-comments': 1,
      'bad4iz/no-empty-array': 1,
      'bad4iz/no-single-letter': 'error',
      'bad4iz/require-aaa': 1,
      'bad4iz/require-emoji-in-testfile': 1,
      'jsdoc/check-indentation': 'off',
      'jsdoc/check-line-alignment': 1,
      'jsdoc/check-syntax': 1,
      'jsdoc/require-description': 1,
      'jsdoc/require-description-complete-sentence': 'error',
      'jsdoc/require-hyphen-before-param-description': 1,
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
        },
      ],
      'jsdoc/require-returns-description': 0,
      'jsdoc/tag-lines': [
        'error',
        'any',
        {
          startLines: 1,
        },
      ],
      'no-console': 1,
      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': 'warn',
      'sort-keys': [
        'warn',
        'asc',
        {
          caseSensitive: true,
          minKeys: 2,
          natural: true,
        },
      ],
      ...eslintPluginReactHooks.configs.recommended.rules,
    },
    settings: {
      jsdoc: {
        mode: 'typescript',

        tagNamePreference: {
          category: 'category',
          todo: {
            message: 'Пожалуйста решите задачу или добавить в трекер',
          },
        },
      },
    },
  },

  {
    files: ['**/*.{ts,tsx}'],

    rules: {
      'jsdoc/require-param-type': 0,
      'jsdoc/require-property-type': 0,
      'jsdoc/require-returns-type': 0,
    },
  },
  // ...compat.extends(),
  {
    languageOptions: {
      globals: {
        ...globals.browser,

        JSX: true,
        React: true,
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
];
