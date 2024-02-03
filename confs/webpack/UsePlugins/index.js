const { useCopyPlugin, defaultConf: copyPluginDefaultConf } = require('./AddCopyPlugin/index.cjs');
const { useEslintPlugin, defaultConf: eslintPluginDefaultConf } = require('./AddEslintPlugin/index.cjs');
const { useHtmlPlugin, defaultConf: htmlPluginDefaultConf } = require('./AddHtmlPlugin/index.cjs');
const { useForkTsCheckerPlugin, defaultConf: forkTsCheckerDefaultConf } = require('./AddForkTsCheckPlugin/index.cjs');
const { useDefinePlugin, defaultConf: definePluginDefaultConf } = require('./AddDefinePlugin/index.cjs');

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

    // use fork ts checker
    useForkTsCheckerPlugin,
    forkTsCheckerDefaultConf,

    // define plugin
    useDefinePlugin,
    definePluginDefaultConf,
};

module.exports = usePlugins;
