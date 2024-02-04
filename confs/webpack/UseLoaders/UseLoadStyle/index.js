const deepFreeze = require('deep-freeze-strict');
const { cloneDeep } = require('lodash');

/** @description basic css loader conf */
const cssLoaderConf = deepFreeze({
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
 * @description Get css / scss / sass / less / stylus load config. You can extend this function
 * @param {Record<string, unknown>} confs basicConf, styleType, styleResourcePatterns
 * @returns
 */
const useLoadStyleConf = (confs = {}) => {
    const { basicConf = cloneDeep(cssLoaderConf), styleType = 'css', styleResourcePatterns = [] } = confs;

    // return value
    let returnConf = { ...basicConf };

    // css pre-processors config
    if (['scss', 'sass', 'less', 'styl', 'stylus'].includes(styleType)) {
        const { oneOf } = cloneDeep(cssLoaderConf);
        const oneOfCopy = [...oneOf];

        // get regular expression for test
        const getTestRegex = () => {
            if (['scss', 'sass'].includes(styleType)) {
                // sass | scss
                return styleType === 'sass' ? /\.sass$/i : /\.scss$/i;
            } else if (['styl', 'stylus'].includes(styleType)) {
                // stylus
                return /\.styl(us)?$/i;
            }

            return /\.less$/i;
        };

        // to get css pre-processor options
        const getLoaderOptions = () => {
            let loader = 'less-loader';

            if (['scss', 'sass'].includes(styleType)) {
                // use sass or scss
                loader = 'sass-loader';
            } else if (['styl', 'stylus'].includes(styleType)) {
                // use stylus
                loader = 'stylus-loader';
            }

            const sourceMap = false;

            // for sass only
            if (styleType === 'sass') {
                return {
                    loader,
                    options: {
                        sourceMap,
                        sassOptions: {
                            indentedSyntax: true,
                        },
                    },
                };
            }

            // general
            return {
                loader,
                options: {
                    sourceMap,
                },
            };
        };

        returnConf = {
            test: getTestRegex(),
            oneOf: oneOfCopy.map(item => {
                const { use } = item;
                const copyUse = [...use];
                copyUse.push(getLoaderOptions());

                return {
                    ...item,
                    use: copyUse,
                };
            }),
        };
    }

    // style-resource-loader patterns config
    if (Array.isArray(styleResourcePatterns) && styleResourcePatterns.length) {
        const { test, oneOf } = returnConf;
        const oneOfCopy = [...oneOf];

        returnConf = {
            test,
            oneOf: oneOfCopy.map(item => {
                const { use } = item;
                const copyUse = [...use];
                copyUse.push({
                    loader: 'style-resources-loader',
                    options: {
                        patterns: [...styleResourcePatterns],
                    },
                });

                return {
                    ...item,
                    use: copyUse,
                };
            }),
        };
    }

    return returnConf;
};

module.exports = {
    cssLoaderConf,
    useLoadStyleConf,
};
