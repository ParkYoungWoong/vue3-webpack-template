// add webpack use
const useLoaders = require('./UseLoaders');
const usePlugins = require('./UsePlugins');

// global configuration of webpack base config
const globalConf = require('./GlobalConf');

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
    webpackBaseConfig,
};
