const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// use clean-webpack-plugin
const usePlugin = (conf = null) => (conf ? new CleanWebpackPlugin(conf) : new CleanWebpackPlugin());

module.exports = {
    usePlugin,
};
