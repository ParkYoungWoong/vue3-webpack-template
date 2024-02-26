import { createBasicConfig, withBasePath } from './confs';
import Config from 'webpack-chain';
import type { Configuration } from 'webpack';

/** @description Add global style-resource for scss file */
function addStyleResource(rule: Config.Rule<Config.Rule<Config.Module>>, patterns: string[] = []) {
    rule.use('style-resource').loader('style-resources-loader').options({
        patterns,
    });
}

/**
 * @description Export a Config Function.
 * See: https://webpack.js.org/configuration/configuration-types/#exporting-a-function
 * @param  environments environments, like dev, prod ...
 * @returns a webpack config
 */
const webpackConfigCallback = (environments: Record<string, unknown>): Configuration => {
    // use env and process.env
    const { dev, prod } = environments;
    const { NODE_ENV = 'development' } = process.env;

    const isDev = !!dev && NODE_ENV === 'development';
    const isProd = !!prod && NODE_ENV === 'production';

    const basicConf = createBasicConfig({
        isDev,
        isProd,
        isCssWithSourceMap: () => isProd,
    });

    ['vue-modules', 'vue', 'css-module', 'css-normal'].forEach(type => {
        addStyleResource(basicConf.module.rule('scss').oneOf(type), [withBasePath('src/assets/_global-conf.scss')]);
    });

    return basicConf.toConfig();
};

export default webpackConfigCallback;
