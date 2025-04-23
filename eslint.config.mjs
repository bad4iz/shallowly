import { fixupPluginRules } from '@eslint/compat';
import pluginJs from '@eslint/js';
import eslintConfigReactApp from 'eslint-config-react-app';
import bad4iz from 'eslint-plugin-bad4iz';
import jsdoc from 'eslint-plugin-jsdoc';
import react from 'eslint-plugin-react';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import vitest from 'eslint-plugin-vitest';
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
      'react-app': eslintConfigReactApp,
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
  // test config
  {
    files: [
      'tests/**',
      '**/*.{jestSpec,jestTest}.{ts,tsx,js,jsx}',
      '**/*.{enzymeSpec}.{ts,tsx,js,jsx}',
      '**/*.{spec,test}.{ts,tsx,js,jsx}',
      '**/*.intest.{ts,tsx,js,jsx}',
    ],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules, // you can also use vitest.configs.all.rules to enable all rules
      'vitest/max-nested-describe': ['error', { max: 3 }], // you can also modify rules' behavior using option like this
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
