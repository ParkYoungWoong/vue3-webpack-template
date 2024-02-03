const { webpackBaseConfig: baseConfig, webpackUse } = require('./confs');
const { useEslintPlugin } = webpackUse.usePlugins;

const { plugins: basePlugins } = baseConfig;

// config plugin hook
const createPluginsAsEnv = env => {
    const { dev } = env;
    const vals = [...basePlugins];

    if (dev) {
        vals.push(useEslintPlugin());
    }

    return vals;
};

/**
 * Exporting a Config Function. See:
 * https://webpack.js.org/configuration/configuration-types/#exporting-a-function
 */
module.exports = env => {
    return {
        ...baseConfig,
        plugins: createPluginsAsEnv(env),
    };
};
