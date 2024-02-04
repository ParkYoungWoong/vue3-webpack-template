const { resolve: pathResolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { cloneDeep } = require('lodash');
const { webpackBaseConfig: baseConfig, webpackUse, webpackHooks } = require('./confs');
const { useLoaders, usePlugins } = webpackUse;
const { useLoadStyleConf } = useLoaders;
const {
    useEslintPlugin,
    useHtmlPlugin,
    htmlPluginDefaultConf,
    useForkTsCheckerPlugin,
    useDefinePlugin,
    useCssExtractPlugin,
} = usePlugins;
const { createLoaders, createPlugins } = webpackHooks;

// loader config function
const configLoaders = (env, argv) => {
    const { prod } = env || {};
    const { mode } = argv || {};

    const { configOneLoader, getConfigOfLoaders } = createLoaders();

    // configure style-resource-loader
    const styleResourcePatterns = [pathResolve(__dirname, 'src/assets/_global-conf.scss')];
    configOneLoader(
        'scss',
        useLoadStyleConf({
            styleType: 'scss',
            styleResourcePatterns,
        })
    );

    // configure production loader options
    if (prod && mode === 'production') {
        // use mini-css-extract-plugin loader
        const basicExtractConf = {
            styleType: 'css',
            isProd: true,
        };

        configOneLoader('css', useLoadStyleConf(basicExtractConf));
        configOneLoader(
            'scss',
            useLoadStyleConf({
                ...basicExtractConf,
                styleType: 'scss',
                styleResourcePatterns,
            })
        );
        configOneLoader(
            'sass',
            useLoadStyleConf({
                ...basicExtractConf,
                styleType: 'sass',
            })
        );
    }

    return getConfigOfLoaders();
};

// config plugin function
const configPluginsAsEnv = (env, argv) => {
    const { dev, prod } = env || {};
    const { mode } = argv || {};

    const { getPluginConfig, configPlugin } = createPlugins();

    // set define plugin
    configPlugin(
        'definePlugin',
        useDefinePlugin({
            isDev: !!dev,
            isProd: !!prod,
        })
    );

    // self-defined HtmlWebpackPlugin configuration
    const htmlPluginSelfConfiguration = Object.assign(cloneDeep(htmlPluginDefaultConf), {
        templateParameters: {
            lang: 'zh-cn',
        },
        title: 'Vue 3 + TypeScript Webpack Project',
    });
    // reset HtmlWebpackPlugin configuration
    configPlugin('htmlPlugin', useHtmlPlugin(htmlPluginSelfConfiguration));

    if (dev) {
        // eslint plugin
        configPlugin('eslintPlugin', useEslintPlugin());

        // ts-checker plugin
        configPlugin('tsCheckerPlugin', useForkTsCheckerPlugin());
    }

    if (prod && mode === 'production') {
        // html plugin in product
        configPlugin(
            'htmlPlugin',
            useHtmlPlugin({
                ...htmlPluginSelfConfiguration,
                minify: true,
            })
        );

        // css extract plugin
        configPlugin('cssExtractPlugin', useCssExtractPlugin());
    }

    return getPluginConfig();
};

/**
 * Exporting a Config Function. See:
 * https://webpack.js.org/configuration/configuration-types/#exporting-a-function
 */
module.exports = (env, argv) => {
    // use env and argv
    const { prod } = env || {};
    const { mode } = argv || {};

    let conf = Object.assign(cloneDeep(baseConfig), {
        module: {
            rules: configLoaders(env, argv),
        },
        plugins: configPluginsAsEnv(env, argv),
    });

    if (prod && mode === 'production') {
        conf = Object.assign(conf, {
            optimization: {
                realContentHash: false,
                splitChunks: {
                    cacheGroups: {
                        defaultVendors: {
                            name: 'chunk-vendors',
                            test: /[\\/]node_modules[\\/]/,
                            priority: -10,
                            chunks: 'initial',
                        },
                        common: {
                            name: 'chunk-common',
                            minChunks: 2,
                            priority: -20,
                            chunks: 'initial',
                            reuseExistingChunk: true,
                        },
                    },
                },
                minimize: true,

                // add minimizer
                minimizer: [
                    new TerserPlugin({
                        parallel: true,
                        extractComments: false,
                        minify: TerserPlugin.uglifyJsMinify,
                        terserOptions: {
                            ecma: 5,
                            compress: {
                                drop_console: true,
                                drop_debugger: true,
                            },
                        },
                    }),
                ],
            },
        });
    }

    return conf;
};
