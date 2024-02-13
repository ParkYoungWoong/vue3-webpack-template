const { resolve: pathResolve } = require('path');
const { cloneDeep } = require('lodash');
const { webpackBaseConfig: baseConfig, webpackUse, webpackHooks } = require('./confs');

// minimizers
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const { useLoaders, usePlugins } = webpackUse;
const { useLoadStyleConf } = useLoaders;
const {
    useEslintPlugin,
    useHtmlPlugin,
    htmlPluginDefaultConf,
    useForkTsCheckerPlugin,
    useDefinePlugin,
    useCssExtractPlugin,
    useCleanPlugin,
} = usePlugins;
const { createLoaders, createPlugins } = webpackHooks;

const { NODE_ENV = 'development' } = process.env;

// loader config function
const configLoaders = env => {
    const { prod } = env || {};

    const { configOneLoader, getConfigOfLoaders } = createLoaders();

    // configure style-resource-loader
    const scssPatterns = [pathResolve(__dirname, 'src/assets/_global-conf.scss')];
    configOneLoader(
        'scss',
        useLoadStyleConf({
            styleType: 'scss',
            styleResourcePatterns: scssPatterns,
        })
    );

    // configure production loader options
    if (prod && NODE_ENV === 'production') {
        // use mini-css-extract-plugin loader
        ['css', 'scss', 'sass'].forEach(styleType => {
            configOneLoader(
                styleType,
                useLoadStyleConf({
                    isUseMiniCssExtract: true,
                    styleType,
                    styleResourcePatterns: styleType === 'scss' ? scssPatterns : null,
                })
            );
        });
    }

    return getConfigOfLoaders();
};

// config plugin function
const configPlugins = env => {
    const { dev, prod } = env || {};

    const { getPluginConfig, configPlugin } = createPlugins();

    // set define plugin
    configPlugin(
        'definePlugin',
        useDefinePlugin({
            isDev: Boolean(dev),
            isProd: Boolean(prod && NODE_ENV === 'production'),
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

    if (prod && NODE_ENV === 'production') {
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

        // clean-webpack-plugin
        configPlugin('cleanWebpackPlugin', useCleanPlugin());
    }

    return getPluginConfig();
};

/**
 * Export a config function.
 * See: https://webpack.js.org/configuration/configuration-types/#exporting-a-function
 */
module.exports = env => {
    // use env and argv
    const { dev, prod } = env || {};

    let conf = Object.assign(cloneDeep(baseConfig), {
        module: {
            rules: configLoaders(env),
        },
        plugins: configPlugins(env),
    });

    if (dev) {
        conf = Object.assign(conf, {
            mode: 'development',
            devtool: 'source-map',
        });
    }

    if (prod && NODE_ENV === 'production') {
        conf = Object.assign(
            conf,
            {
                mode: 'production',
                devtool: 'nosources-source-map',
            },
            {
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
                        new CssMinimizerPlugin(),
                    ],
                },
            }
        );
    }

    return conf;
};
