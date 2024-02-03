/**
 * @description
 *
 * Define hooks for configuration.
 * All hook should start with "create"
 */

// import hooks
const createEntry = require('./CreateEntry');
const createLoaders = require('./CreateLoaders');
const createPlugins = require('./CreatePlugins');
const { createDevServerConf, baseConfig: devServerBaseConfig } = require('./CreateDevServer');

// hooks collection
const webpackHooks = {
    createEntry,
    createLoaders,
    createPlugins,
    createDevServerConf,
    devServerBaseConfig,
};

module.exports = webpackHooks;
