import Config from 'webpack-chain';
import compose from 'compose-function';
// plugins
import { VueLoaderPlugin } from 'vue-loader';
import { DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { withBasePath, configExtensions, kb, loadStyles, loadJs, vExtensions } from './utils';
import type { MinifyOptions } from 'terser';
const { uglifyJsMinify } = TerserPlugin;

type ComposedConfigCallback = (conf: Config) => Config;

export type BasicConfigOpts = Partial<{
    /** @description is development */
    isDev: boolean;
    /** @description is production */
    isProd: boolean;
    /** @description is compile css with source map */
    isCssWithSourceMap: (() => boolean) | boolean;
    /** Language of the project */
    lang: string;
    /** HTML Title */
    title: string;
    /** babel only compile, which is more important than `babelNotCompiles` */
    babelOnlyCompiles: (string | RegExp)[];
    /** babel not compile */
    babelNotCompiles: (string | RegExp)[];
}>;

/**
 * @description Use webpack-chain to create a basic `Config` object.
 * @param opts
 * @returns
 */
export function createBasicConfig(opts: BasicConfigOpts = {}): Config {
    const {
        isDev = true,
        isProd = false,
        isCssWithSourceMap = false,
        lang = 'zh-cn',
        title = 'vue-webpack-template',
        babelNotCompiles = [],
        babelOnlyCompiles = [],
    } = opts;

    /** @description to compose functions which can config conditionally */
    const composeConditionalConfiguration: ComposedConfigCallback = compose(
        (conf: Config) => loadStyles(conf, { isDev, isTakingSourceMap: isCssWithSourceMap, styleType: 'sass' }),
        (conf: Config) => loadStyles(conf, { isDev, isTakingSourceMap: isCssWithSourceMap, styleType: 'scss' }),
        (conf: Config) => loadStyles(conf, { isDev, isTakingSourceMap: isCssWithSourceMap }),
        (conf: Config) =>
            loadJs(conf, {
                isProd,
                notCompiles: babelNotCompiles,
                onlyCompiles: babelOnlyCompiles,
            }),
        (conf: Config) => configExtensions(conf)
    );

    return composeConditionalConfiguration(
        new Config()
            // set entry
            .entry('index')
            .add(withBasePath('src/main.ts'))
            .end()
            // set context
            .context(withBasePath())
            // output
            .output.path(withBasePath('dist'))
            .hashFunction('xxhash64')
            .filename('js/[name].[contenthash].bundle.js')
            .chunkFilename('js/[name].[contenthash].js')
            // Set output.clean to replace CleanWebpackPlugin. See: https://webpack.js.org/configuration/output/#outputclean
            .set('clean', true)
            .end()
            // set alias
            .resolve.alias.set('@', withBasePath('src'))
            .end()
            .end()
            // set loaders
            .module // set loaders for vue
            .rule('vue')
            .test(/\.vue$/i)
            .use('vue-loader')
            .loader('vue-loader')
            .end()
            .end()
            .rule('vue-style')
            .test(/\.vue$/i)
            .resourceQuery(/type=style/)
            .set('sideEffects', true)
            .end()
            // set loaders for fonts
            .rule('fonts')
            .test(/\.(woff2?|eot|[ot]tf)$/i)
            .set('type', 'asset/resource')
            .end()
            .rule('pics')
            .test(/\.(png|jpe?g|gif)$/i)
            .set('type', 'asset/resource')
            .set('generator', {
                filename: 'static/[hash][ext][query]',
            })
            .parser({
                dataUrlCondition: {
                    // 10kb
                    maxSize: kb(10),
                },
            })
            .end()
            .end()
            // config plugins
            .plugin('VueLoaderPlugin')
            .use(VueLoaderPlugin)
            .end()
            // set plugins
            .plugin('HtmlWebpackPlugin')
            .use(HtmlWebpackPlugin, [
                {
                    template: withBasePath('html/index.htm'),
                    templateParameters: { lang },
                    inject: 'body',
                    favicon: withBasePath('html/favicon.ico'),
                    title,
                },
            ])
            .end()
            .plugin('DefinePlugin')
            .use(DefinePlugin, [{ isDev, isProd }])
            .end()
            // check ts
            .plugin('ForkTsCheckerWebpackPlugin')
            .use(ForkTsCheckerWebpackPlugin, [
                {
                    async: true,
                    typescript: {
                        diagnosticOptions: {
                            semantic: true,
                            syntactic: true,
                        },
                        // add vue extension
                        extensions: {
                            vue: {
                                enabled: true,
                                compiler: require.resolve('vue/compiler-sfc'),
                            },
                        },
                    },
                    eslint: {
                        enabled: true,
                        files: './src/**/*.{ts,tsx,js,jsx,vue}',
                    },
                },
            ])
            .end()
            // split chunks
            .optimization.splitChunks({
                chunks: 'all',
                minSize: 15000,
            })
            .end()
            // set in development mode
            .when(isDev, configure => {
                configure
                    .devtool('source-map')
                    .mode('development')
                    // set devServer
                    .devServer.compress(true)
                    .port(2080)
                    .hot(true)
                    .open(false)
                    .end()
                    .plugin('ESLintPlugin')
                    .use(ESLintPlugin, [
                        {
                            extensions: vExtensions,
                            fix: true,
                            threads: true,
                        },
                    ])
                    .end();
            })
            // set in production mode
            .when(isProd, configure => {
                configure
                    .devtool('eval')
                    .mode('production')
                    .optimization.minimize(true)
                    .minimizer('TerserPlugin')
                    .use(TerserPlugin<MinifyOptions>, [
                        {
                            extractComments: true,
                            minify: uglifyJsMinify,
                            terserOptions: {
                                ecma: 5,
                                compress: {
                                    drop_console: true,
                                    drop_debugger: true,
                                },
                            },
                        },
                    ])
                    .end()
                    .minimizer('CssMinimizerPlugin')
                    .use(CssMinimizerPlugin)
                    .end()
                    .splitChunks({
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
                    })
                    .set('realContentHash', false)
                    // html webpack plugin
                    .end()
                    .plugin('HtmlWebpackPlugin')
                    .tap(([oldConf]) => [
                        {
                            ...oldConf,
                            minify: true,
                        },
                    ])
                    .end()
                    .plugin('MiniCssExtractPlugin')
                    .use(MiniCssExtractPlugin, [{ filename: 'style/[name]-[contenthash].css' }])
                    .end();
            })
    );
}
