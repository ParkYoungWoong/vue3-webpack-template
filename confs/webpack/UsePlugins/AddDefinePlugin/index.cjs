const { DefinePlugin } = require('webpack');

// default configuration
const defaultConf = Object.freeze({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
});

// use eslint-webpack-plugin
const useDefinePlugin = (conf = defaultConf) => new DefinePlugin(conf);

module.exports = {
    useDefinePlugin,
    defaultConf,
};
