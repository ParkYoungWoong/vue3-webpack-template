const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// default configuration
const defaultConf = Object.freeze({
    typescript: {
        // add vue extension
        extensions: {
            vue: {
                enabled: true,
                compiler: require('vue/compiler-sfc'),
            },
        },
        diagnosticOptions: {
            semantic: true,
            syntactic: false,
        },
    },
});

// use eslint-webpack-plugin
const useForkTsCheckerPlugin = (conf = defaultConf) => new ForkTsCheckerWebpackPlugin(conf);

module.exports = {
    useForkTsCheckerPlugin,
    defaultConf,
};
