// eslint.config.js
module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'prettier',
        'import',
    ],
    rules: {
        // Basic ESLint rules
        'no-console': 'warn',
        'no-unused-vars': 'off', // handled by @typescript-eslint
        'no-var': 'error',
        'prefer-const': 'error',
        'semi': ['error', 'always'],
        'quotes': ['error', 'single'],
        'eqeqeq': ['error', 'always'],

        // TypeScript rules
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],

        // Prettier rules
        'prettier/prettier': ['error', {
            singleQuote: true,
            semi: true,
            trailingComma: 'es5',
        }],

        // Import rules
        'import/order': ['error', {
            'groups': ['builtin', 'external', 'internal'],
            'pathGroups': [
                {
                    'pattern': 'react',
                    'group': 'external',
                    'position': 'before',
                },
            ],
            'pathGroupsExcludedImportTypes': ['react'],
            'newlines-between': 'always',
            'alphabetize': { 'order': 'asc', 'caseInsensitive': true },
        }],
        'import/no-unresolved': 'error',
        'import/named': 'error',
        'import/default': 'error',
        'import/namespace': 'error',
    },
};

