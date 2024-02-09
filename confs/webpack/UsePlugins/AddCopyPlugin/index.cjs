const CopyPlugin = require('copy-webpack-plugin');
const deepFreeze = require('deep-freeze-strict');

// default configuration
const defaultConf = deepFreeze({
    patterns: [{ from: 'static' }],
});

// use copy-plugin
const usePlugin = (conf = defaultConf) => new CopyPlugin(conf);

module.exports = {
    usePlugin,
    defaultConf,
};
