const ESLintPlugin = require('eslint-webpack-plugin');
const { extensions } = require('../../GlobalConf');

// default configuration
const defaultConf = Object.freeze({
    extensions,
    fix: true,
    threads: true,
});

// use eslint-webpack-plugin
const useEslintPlugin = (conf = defaultConf) => new ESLintPlugin(conf);

module.exports = {
    useEslintPlugin,
    defaultConf,
};
