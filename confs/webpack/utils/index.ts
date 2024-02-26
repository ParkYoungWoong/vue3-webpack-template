import Config from 'webpack-chain';

export { withBasePath } from './with-base-path';
export { loadStyles } from './load-styles';
export { loadJs } from './load-js';

/** @description extensions for vue */
export const vExtensions = ['.cjs', '.mjs', '.js', '.cts', '.mts', '.ts', '.jsx', '.tsx', '.vue', '.json'];

/**
 * @description to configure the extensions used by the Vue project
 * @param confInstance the webpack-chain Config instance
 * @returns the instance self
 */
export function configExtensions(confInstance: Config): Config {
    const { extensions: confExts } = confInstance.resolve;
    vExtensions.forEach(ext => {
        confExts.add(ext);
    });
    return confExts.end().end();
}

/**
 * @description get kb
 * @param kbNum kb's num, default 1
 * @returns kb
 */
export function kb(kbNum = 1): number {
    return 1024 * kbNum;
}
