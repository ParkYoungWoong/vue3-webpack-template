/** @description basic css loader conf */
const cssLoaderConf = Object.freeze({
    test: /\.css$/i,
    oneOf: [
        /* config.module.rule('css').oneOf('vue-modules') */
        {
            resourceQuery: /module/,
            use: [
                {
                    loader: 'vue-style-loader',
                    options: {
                        sourceMap: false,
                        shadowMode: false,
                    },
                },
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: false,
                        importLoaders: 2,
                        modules: {
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                            auto: () => true,
                        },
                    },
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: false,
                    },
                },
            ],
        },
        /* config.module.rule('css').oneOf('vue') */
        {
            resourceQuery: /\?vue/,
            use: [
                {
                    loader: 'vue-style-loader',
                    options: {
                        sourceMap: false,
                        shadowMode: false,
                    },
                },
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: false,
                        importLoaders: 2,
                    },
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: false,
                    },
                },
            ],
        },
        /* config.module.rule('css').oneOf('normal-modules') */
        {
            test: /\.module\.\w+$/,
            use: [
                {
                    loader: 'vue-style-loader',
                    options: {
                        sourceMap: false,
                        shadowMode: false,
                    },
                },
                /* config.module.rule('css').oneOf('normal-modules').use('css-loader') */
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: false,
                        importLoaders: 2,
                    },
                },
                /* config.module.rule('css').oneOf('normal-modules').use('postcss-loader') */
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: false,
                    },
                },
            ],
        },
        /* config.module.rule('css').oneOf('normal') */
        {
            use: [
                /* config.module.rule('css').oneOf('normal').use('vue-style-loader') */
                {
                    loader: 'vue-style-loader',
                    options: {
                        sourceMap: false,
                        shadowMode: false,
                    },
                },
                /* config.module.rule('css').oneOf('normal').use('css-loader') */
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: false,
                        importLoaders: 2,
                    },
                },
                /* config.module.rule('css').oneOf('normal').use('postcss-loader') */
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: false,
                    },
                },
            ],
        },
    ],
});

/**
 * Generate a vue style load conf
 * @param {string} styleType sass scss (or you can add less or stylus)
 * @returns config of style
 */
const useLoadStyleConf = (styleType = 'css') => {
    if (['scss', 'sass'].includes(styleType)) {
        const { oneOf } = cssLoaderConf;
        const oneOfCopy = [...oneOf];

        const getSassOptions = () => {
            const sourceMap = false;
            const sassOptions = {
                indentedSyntax: true,
            };

            if (styleType === 'sass') {
                return {
                    sourceMap,
                    sassOptions,
                };
            }

            return {
                sourceMap,
            };
        };

        return {
            test: styleType === 'sass' ? /\.sass$/i : /\.scss$/i,
            oneOf: oneOfCopy.map(item => {
                const { use } = item;
                const copyUse = [...use];
                copyUse.push({
                    loader: 'sass-loader',
                    options: getSassOptions(),
                });

                return {
                    ...item,
                    use: copyUse,
                };
            }),
        };
    }

    return { ...cssLoaderConf };
};

module.exports = {
    cssLoaderConf,
    useLoadStyleConf,
};
