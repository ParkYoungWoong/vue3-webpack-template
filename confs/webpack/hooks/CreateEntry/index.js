const { resolve } = require('path');
const deepFreeze = require('deep-freeze-strict');
const { cloneDeep } = require('lodash');

const baseConfig = deepFreeze({
    index: [resolve(__dirname, '../../../../src/main.ts')],
});

/**
 * create entry config
 * @param {Record<string, unknown>} yourConfig add your config of entry
 * @returns an entry config
 */
const createEntry = (yourConfig = {}) => Object.assign(cloneDeep(baseConfig), yourConfig);

module.exports = createEntry;
