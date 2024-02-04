const deepFreeze = require('deep-freeze-strict');

/** @description basic config */
const baseConfig = deepFreeze({
    host: 'localhost',
    port: 6060,
    hot: true,
    compress: true,
});

/**
 * create devServer config
 * @param {Record<string, unknown>} yourConfig add your config of devServer
 * @returns a devServer config
 */
const createDevServerConf = (yourConfig = {}) => Object.assign(Object.create(null), baseConfig, yourConfig);

module.exports = {
    createDevServerConf,
    baseConfig,
};
