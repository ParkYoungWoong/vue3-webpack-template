import { createApp, type Plugin } from 'vue';
import { hashRouter } from '@/views/router';
import { store } from '@/store';

type VueApp = ReturnType<typeof createApp>;

/**
 * @description To install the plugins used by the project
 * @param appInst the vue application instance
 * @returns the app instance itself
 */
export const installPlugins = (appInst: VueApp): VueApp => {
    const vPlugins: Plugin[] = [hashRouter, store];
    return vPlugins.reduce((inst, plugin) => inst.use(plugin), appInst);
};
