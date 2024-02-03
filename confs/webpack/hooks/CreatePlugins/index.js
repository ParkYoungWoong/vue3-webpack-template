const { VueLoaderPlugin } = require('vue-loader');
const usePlugins = require('../../UsePlugins');

/**
 * @description A hook to create plugins
 * @param {Record<string, unknown>} yourConfig Your plugin conf
 * @returns three functions to create plugin conf
 */
const createPlugins = (yourConfig = {}) => {
    const { useHtmlPlugin, useCopyPlugin } = usePlugins;

    let res = Object.assign(
        Object.create(null),
        // basic config
        {
            htmlPlugin: useHtmlPlugin(),
            copyPlugin: useCopyPlugin(),
            vueLoaderPlugin: new VueLoaderPlugin(),
        },
        {
            ...yourConfig,
        }
    );

    /** @description get all plugins having been added */
    const getCurrentPlugins = () => Object.keys(res);

    /** @description use this function to config a plugin or add a plugin */
    const configPlugin = (key, pluginConf) => {
        res = Object.assign(res, {
            [key]: pluginConf,
        });
    };

    /** @description get the result of plugin config */
    const getPluginConfig = () => Object.keys(res).map(k => res[k]);

    return {
        getCurrentPlugins,
        configPlugin,
        getPluginConfig,
    };
};

module.exports = createPlugins;
