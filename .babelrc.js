module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: '3.35',
            },
        ],
        '@babel/preset-typescript',
    ],
    plugins: [['@babel/plugin-transform-runtime']],
};
