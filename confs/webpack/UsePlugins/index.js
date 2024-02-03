const { useCopyPlugin, defaultConf: copyPluginDefaultConf } = require('./AddCopyPlugin/index.cjs');
const { useEslintPlugin, defaultConf: eslintPluginDefaultConf } = require('./AddEslintPlugin/index.cjs');
const { useHtmlPlugin, defaultConf: htmlPluginDefaultConf } = require('./AddHtmlPlugin/index.cjs');

/** @description webpack use, include plugins and others */
const usePlugins = {
    // use eslint webpack plugin
    useEslintPlugin,
    eslintPluginDefaultConf,

    // use html webpack plugin
    useHtmlPlugin,
    htmlPluginDefaultConf,

    // use copy plugin
    useCopyPlugin,
    copyPluginDefaultConf,
};

module.exports = usePlugins;
