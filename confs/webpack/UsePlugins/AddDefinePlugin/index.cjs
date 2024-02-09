const { DefinePlugin } = require('webpack');

// default configuration
const defaultConf = Object.freeze({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
});

// use define-plugin
const useDefinePlugin = (conf = {}) =>
    new DefinePlugin({
        ...defaultConf,
        ...conf,
    });

module.exports = {
    useDefinePlugin,
    defaultConf,
};
