module.exports = {
    extends: ['plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }
        }
    },
    globals: {
        // Jest testing globals
        it: true,
        expect: true,
        describe: true,
        afterAll: true,
        beforeAll: true
    },
    rules: {
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    },
    overrides: {
        excludedFiles: 'build/*'
    }
};
