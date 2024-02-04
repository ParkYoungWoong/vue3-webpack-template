const HtmlPlugin = require('html-webpack-plugin');
const { resolve } = require('path');
const deepFreeze = require('deep-freeze-strict');

// default configuration
const defaultConf = deepFreeze({
    template: resolve(__dirname, '../../../../html/index.htm'),
    favicon: resolve(__dirname, '../../../../html/favicon.ico'),
    templateParameters: {
        lang: 'en-uk',
    },
    inject: 'body',
    title: 'Webpack project!',
});

// use eslint-webpack-plugin
const useHtmlPlugin = (conf = defaultConf) => new HtmlPlugin(conf);

module.exports = {
    useHtmlPlugin,
    defaultConf,
};
