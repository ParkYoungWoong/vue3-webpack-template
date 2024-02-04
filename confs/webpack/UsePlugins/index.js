const { useEslintPlugin, defaultConf: eslintPluginDefaultConf } = require('./AddEslintPlugin/index.cjs');
const { useHtmlPlugin, defaultConf: htmlPluginDefaultConf } = require('./AddHtmlPlugin/index.cjs');
const { useForkTsCheckerPlugin, defaultConf: forkTsCheckerDefaultConf } = require('./AddForkTsCheckPlugin/index.cjs');
const { useDefinePlugin, defaultConf: definePluginDefaultConf } = require('./AddDefinePlugin/index.cjs');
const { usePlugin: useCopyPlugin, defaultConf: copyPluginDefaultConf } = require('./AddCopyPlugin/index.cjs');
const {
    usePlugin: useCssExtractPlugin,
    defaultConf: cssExtractDefaultConf,
} = require('./AddMiniCssExtractPlugin/index.cjs');

/** @description webpack use, include plugins and others */
const usePlugins = {
    // eslint-webpack-plugin
    useEslintPlugin,
    eslintPluginDefaultConf,

    // html-webpack-plugin
    useHtmlPlugin,
    htmlPluginDefaultConf,

    // copy-plugin
    useCopyPlugin,
    copyPluginDefaultConf,

    // fork-ts-check-plugin
    useForkTsCheckerPlugin,
    forkTsCheckerDefaultConf,

    // define-plugin
    useDefinePlugin,
    definePluginDefaultConf,

    // mini-css-extract-plugin
    useCssExtractPlugin,
    cssExtractDefaultConf,
};

module.exports = usePlugins;
