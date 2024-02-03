const path = require('path');

const baseConfig = Object.freeze({
    index: [path.resolve(__dirname, '../../../../src/main.ts')],
});

/**
 * create entry config
 * @param {Record<string, unknown>} yourConfig add your config of entry
 * @returns an entry config
 */
const createEntry = (yourConfig = {}) => Object.assign(Object.create(null), baseConfig, yourConfig);

module.exports = createEntry;
