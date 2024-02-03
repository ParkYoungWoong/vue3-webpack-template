module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
        es2023: true,
        // 必须设置这一行, 否则会提示编译宏未定义的错误!
        'vue/setup-compiler-macros': true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/typescript/recommended',
        'plugin:prettier/recommended',
        'prettier',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 2023,
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
        ecmaFeatures: {
            jsx: true,
            modules: true,
        },
    },
    plugins: ['prettier', '@typescript-eslint', 'vue'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        semi: ['error', 'always'],
        // 这条规则可修正's问题
        quotes: ['error', 'single', { avoidEscape: true }],
        indent: ['error', 4, { SwitchCase: 1 }],
        'prettier/prettier': [
            'error',
            {},
            {
                usePrettierrc: true,
            },
        ],
        'vue/multi-word-component-names': 'off',
    },
};
