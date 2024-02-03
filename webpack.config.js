const { webpackBaseConfig: baseConfig, webpackUse, webpackHooks } = require('./confs');
const TerserPlugin = require('terser-webpack-plugin');
const {
    useEslintPlugin,
    useHtmlPlugin,
    htmlPluginDefaultConf,
    useForkTsCheckerPlugin,
    useDefinePlugin,
    definePluginDefaultConf,
} = webpackUse.usePlugins;
const { createLoaders, createPlugins } = webpackHooks;

// config loaders function
const configLoaders = () => {
    const { getConfigOfLoaders } = createLoaders();
    return getConfigOfLoaders();
};

// config plugin function
const configPluginsAsEnv = env => {
    const { getPluginConfig, configPlugin } = createPlugins();
    const { dev, prod } = env;

    // set define plugin
    configPlugin(
        'definePlugin',
        useDefinePlugin({
            ...definePluginDefaultConf,
            isDev: !!dev,
            isProd: !!prod,
        })
    );

    // self-defined HtmlWebpackPlugin configuration
    const htmlPluginSelfConfiguration = {
        ...htmlPluginDefaultConf,
        templateParameters: {
            lang: 'zh-cn',
        },
        title: 'Vue 3 + TypeScript Webpack Project',
    };

    if (dev) {
        // html plugin in dev
        configPlugin('htmlPlugin', useHtmlPlugin(htmlPluginSelfConfiguration));

        // eslint plugin
        configPlugin('eslintPlugin', useEslintPlugin());

        // ts-checker plugin
        configPlugin('tsCheckerPlugin', useForkTsCheckerPlugin());
    }

    if (prod) {
        // html plugin in product
        configPlugin(
            'htmlPlugin',
            useHtmlPlugin({
                ...htmlPluginSelfConfiguration,
                minify: true,
            })
        );
    }

    return getPluginConfig();
};

/**
 * Exporting a Config Function. See:
 * https://webpack.js.org/configuration/configuration-types/#exporting-a-function
 */
module.exports = env => {
    const { prod } = env;

    let conf = Object.assign(Object.create(null), {
        ...baseConfig,
        module: {
            rules: configLoaders(),
        },
        plugins: configPluginsAsEnv(env),
    });

    if (prod) {
        conf = Object.assign(conf, {
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

            // add minizer
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            arrows: false,
                            collapse_vars: false,
                            comparisons: false,
                            computed_props: false,
                            hoist_funs: false,
                            hoist_props: false,
                            hoist_vars: false,
                            inline: false,
                            loops: false,
                            negate_iife: false,
                            properties: false,
                            reduce_funcs: false,
                            reduce_vars: false,
                            switches: false,
                            toplevel: false,
                            typeofs: false,
                            booleans: true,
                            if_return: true,
                            sequences: true,
                            unused: true,
                            conditionals: true,
                            dead_code: true,
                            evaluate: true,
                        },
                        mangle: {
                            safari10: true,
                        },
                    },
                    parallel: true,
                    extractComments: false,
                    minify: TerserPlugin.uglifyJsMinify,
                }),
            ],
        });
    }

    return conf;
};
