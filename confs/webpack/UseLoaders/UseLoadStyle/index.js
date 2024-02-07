const deepFreeze = require('deep-freeze-strict');
const { cloneDeep } = require('lodash');
const { loader: miniLoader } = require('mini-css-extract-plugin');

const styleUse = [
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
];

/** @description basic css loader conf for Vue.js */
const cssLoaderConf = deepFreeze({
    test: /\.css$/i,
    oneOf: [
        /* config.module.rule('css').oneOf('vue-modules') */
        {
            resourceQuery: /module/,
            use: [...styleUse],
        },
        /* config.module.rule('css').oneOf('vue') */
        {
            resourceQuery: /\?vue/,
            use: [...styleUse],
        },
        /* config.module.rule('css').oneOf('normal-modules') */
        {
            test: /\.module\.\w+$/,
            use: [...styleUse],
        },
        /* config.module.rule('css').oneOf('normal') */
        {
            use: [...styleUse],
        },
    ],
});

/**
 * @description Get css / scss / sass / less / stylus load config. You can extend this function
 * @param {Record<string, unknown>} confs styleType, styleResourcePatterns, isUseMiniCssExtract
 * @returns
 */
const useLoadStyleConf = (confs = {}) => {
    const {
        styleType = 'css',
        styleResourcePatterns = [],
        // to use mini css extract plugin at production mode
        isUseMiniCssExtract = false,
    } = confs;

    // return value
    let returnConf = cloneDeep(cssLoaderConf);

    // css pre-processors config
    if (['scss', 'sass', 'less', 'styl', 'stylus'].includes(styleType)) {
        const { oneOf: oldOneOf } = returnConf;

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

        returnConf = Object.assign(returnConf, {
            test: getTestRegex(),
            oneOf: oldOneOf.map(item => {
                const { use: oldUse } = item;
                return {
                    ...item,
                    use: [...oldUse, getLoaderOptions()],
                };
            }),
        });
    }

    // style-resource-loader patterns config
    if (Array.isArray(styleResourcePatterns) && styleResourcePatterns.length) {
        const { oneOf: oldOneOf } = returnConf;

        returnConf = Object.assign(returnConf, {
            oneOf: oldOneOf.map(item => {
                const { use: oldUse } = item;

                return {
                    ...item,
                    use: [
                        ...oldUse,
                        {
                            loader: 'style-resources-loader',
                            options: {
                                patterns: [...styleResourcePatterns],
                            },
                        },
                    ],
                };
            }),
        });
    }

    /**
     * Configure mini-css-extract-plugin.
     * See: https://vue-loader.vuejs.org/guide/extract-css.html
     */
    if (isUseMiniCssExtract) {
        const { oneOf: oldOneOf } = returnConf;

        returnConf = Object.assign(returnConf, {
            oneOf: oldOneOf.map(item => {
                const { use: oldUse } = item;

                return {
                    ...item,
                    use: oldUse.map((styleItem, idx) => {
                        if (!idx) {
                            return {
                                loader: miniLoader,
                            };
                        }

                        return styleItem;
                    }),
                };
            }),
        });
    }

    return returnConf;
};

module.exports = {
    cssLoaderConf,
    useLoadStyleConf,
};
