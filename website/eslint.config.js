import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
    {
        ignores: ['dist/**', 'node_modules/**', 'eslint.config.js', 'test/ordnerScript.js'],
    },
    {
        linterOptions: {
            reportUnusedDisableDirectives: 'off',
        },
    },
    {
        ...eslint.configs.recommended,
        files: ['src/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}', '*.{js,ts}'],
    },
    {
        files: ['src/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}', '*.{js,ts}'],
        languageOptions: {
            parser: tsParser,
            globals: {
                ...globals.browser,
                ...globals.es2020,
                ...globals.node,
                ...globals.vitest,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            'no-undef': 'off',
            'no-unused-vars': 'off',
            'no-unused-expressions': 'off',
            'no-dupe-else-if': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-wrapper-object-types': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            'react-refresh/only-export-components': 'off',
        },
    },
    prettier,
];
