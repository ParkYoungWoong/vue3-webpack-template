module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: '3.36',
            },
        ],
        '@babel/preset-typescript',
    ],
    plugins: [['@babel/plugin-transform-runtime']],
};
