const CopyPlugin = require('copy-webpack-plugin');

// default configuration
const defaultConf = Object.freeze({
    patterns: [{ from: 'static' }],
});

// use eslint-webpack-plugin
const useCopyPlugin = (conf = defaultConf) => new CopyPlugin(conf);

module.exports = {
    useCopyPlugin,
    defaultConf,
};
