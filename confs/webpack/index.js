// global configuration of webpack base config
const globalConf = require('./GlobalConf');

// add webpack use
const useLoaders = require('./UseLoaders');
const usePlugins = require('./UsePlugins');

// webpack hooks
const webpackHooks = require('./hooks');

// base config
const { webpackBaseConfig } = require('./BaseConfig');

/** @description webpack use, include plugins and others */
const webpackUse = {
    useLoaders,
    usePlugins,
};

module.exports = {
    globalConf,
    webpackUse,
    webpackHooks,
    webpackBaseConfig,
};
