const { VueLoaderPlugin } = require('vue-loader');
const deepFreeze = require('deep-freeze-strict');
const { cloneDeep } = require('lodash');
const usePlugins = require('../../UsePlugins');
const { useHtmlPlugin } = usePlugins;

/** @description basic plugin configuration */
const basicConfig = deepFreeze({
    // basic config
    htmlPlugin: useHtmlPlugin(),
    vueLoaderPlugin: new VueLoaderPlugin(),
});

/**
 * @description A hook to create plugins
 * @param {Record<string, unknown>} yourConfig Your plugin conf
 * @returns three functions to create plugin conf
 */
const createPlugins = (yourConfig = {}) => {
    let res = Object.assign(Object.create(null), cloneDeep(basicConfig), yourConfig);

    /** @description get all plugins having been added by name */
    const getAllPluginsByName = () => Object.keys(res);

    /** @description use this function to get the configuration of the plugin given name */
    const getOnePluginConfig = () => pluginName => {
        if (getAllPluginsByName().includes(pluginName)) {
            return Object.freeze(Object.assign(Object.create(null), res[pluginName]));
        }

        return null;
    };
    /** @description get all plugins having been added by key-value */
    const getAllPluginsConfig = () => Object.freeze(Object.assign(Object.create(null), res));

    /** @description use this function to config a plugin or add a plugin */
    const configPlugin = (key, pluginConf) => {
        res = Object.assign(res, {
            [key]: pluginConf,
        });
    };

    /** @description get the result of plugin config */
    const getPluginConfig = () => Object.values(res);

    return {
        getAllPluginsByName,
        getOnePluginConfig,
        getAllPluginsConfig,
        configPlugin,
        getPluginConfig,
    };
};

module.exports = createPlugins;
