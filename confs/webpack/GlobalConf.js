const deepFreeze = require('deep-freeze-strict');

/** @description add config here */
const globalConf = {
    extensions: ['.cjs', '.mjs', '.js', '.cts', '.mts', '.ts', '.jsx', '.tsx', '.vue', '.json'],
};

module.exports = deepFreeze(globalConf);
