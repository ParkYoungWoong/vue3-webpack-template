import Config from 'webpack-chain';
import { loader as miniLoader } from 'mini-css-extract-plugin';

/** valid style types */
type StyleType = ['css', 'sass', 'scss', 'less', 'styl', 'stylus'][number];

/**
 * @description Generate a function used by 'auto'
 * @param suffix style suffix without dot
 * @returns a function used by 'auto'
 */
const genAutoFunc = (suffix: StyleType = 'scss') => {
    /** @param rp resolvedPath */
    function cb(rp: string) {
        if (['styl', 'stylus'].includes(suffix)) {
            return rp.endsWith('.styl') || rp.endsWith('.stylus');
        }

        return rp.endsWith(`.${suffix}`);
    }

    return cb;
};

/**
 * @description Generate some config of css preprocessors
 * @param styleType style type supported
 */
const genStyleConfigWithPreloader = (opts: Partial<{ styleType: StyleType; sourceMap: boolean }> = {}) => {
    const { styleType = 'scss', sourceMap = false } = opts || {};
    const styleTypeList = ['sass', 'scss', 'less', 'styl', 'stylus'];

    if (styleTypeList.includes(styleType)) {
        // List basic keys
        let regex = /\.scss$/i;
        let selfLoaderName = 'sass-loader';
        let selfLoaderOptions: {
            [key: string]: unknown;
            sourceMap: boolean;
        } = { sourceMap };

        // for sass
        if (styleType === 'sass') {
            regex = /\.sass$/i;
            selfLoaderOptions = Object.assign(selfLoaderOptions, {
                sassOptions: {
                    indentedSyntax: true,
                },
            });
        }

        // for less
        if (styleType === 'less') {
            regex = /\.less$/i;
            selfLoaderName = 'less-loader';
            selfLoaderOptions = Object.assign(selfLoaderOptions, {
                ...selfLoaderOptions,
                lessOptions: {
                    // If you use antd as your project's UI library, this line is very important!
                    javascriptEnabled: true,
                },
            });
        }

        // for stylus
        if (['styl', 'stylus'].includes(styleType)) {
            regex = /\.styl(us)?$/i;
            selfLoaderName = 'stylus-loader';
        }

        return {
            regex,
            selfLoaderName,
            selfLoaderOptions,
        };
    }

    return null;
};

/**
 * @description create css or css-pre configuration
 * @param extension style type
 * @param opts other options
 * @returns basic config
 */
function createPreStyleConf(
    extension: StyleType = 'css',
    opts: Partial<{
        isDev: boolean;
        sourceMap: boolean;
        isCssModule: boolean;
    }> = {}
) {
    const { isDev = true, sourceMap = false, isCssModule = true } = opts || {};

    // importLoaders
    const importLoaders = Number(extension === 'css') + 1;

    const getCssLoaderOptions = () => {
        const basicOpts = { sourceMap, importLoaders };

        if (!isCssModule) {
            return {
                ...basicOpts,
                modules: false,
            };
        }

        return {
            ...basicOpts,
            modules: {
                localIdentName: '[name]_[local]_[hash:base64:5]',
                auto: genAutoFunc(extension),
            },
        };
    };

    const baseStyleUse = [
        {
            loader: isDev ? 'vue-style-loader' : miniLoader,
            options: {
                sourceMap,
                shadowMode: false,
            },
        },
        {
            loader: 'css-loader',
            options: getCssLoaderOptions(),
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap,
            },
        },
    ];

    const preConf = genStyleConfigWithPreloader({
        styleType: extension,
        sourceMap,
    });

    let regex = /\.css$/i;

    if (preConf) {
        const { regex: re, selfLoaderName: loader, selfLoaderOptions } = preConf;
        regex = re;
        baseStyleUse.push({
            loader,
            options: selfLoaderOptions,
        });
    }

    return {
        regex,
        baseStyleUse,
    };
}

/**
 * @description configure the styles
 * @param conf the Config instance
 * @param options the options of the function
 * @returns style conf
 */
export function loadStyles(
    conf: Config,
    options: Partial<{
        isDev: boolean;
        isTakingSourceMap: (() => boolean) | boolean;
        styleType: StyleType;
    }> = {}
): Config {
    const { isDev = true, isTakingSourceMap = false, styleType = 'css' } = options;

    const sourceMap = typeof isTakingSourceMap === 'function' ? isTakingSourceMap() : isTakingSourceMap;

    // css is needed
    const { baseStyleUse: cssModuleConf } = createPreStyleConf('css', {
        isDev,
        sourceMap,
        isCssModule: true,
    });

    // config with module
    const vueWithModule = conf.module
        .rule('css')
        .test(/\.css$/i)
        .oneOf('vue-modules')
        .resourceQuery(/module/);

    const cssWithModule = conf.module
        .rule('css')
        .test(/\.css$/i)
        .oneOf('css-module')
        .test(/\.module\.\w+$/i);

    cssModuleConf.forEach(({ loader: loaderName, options: loaderOpts }) => {
        const curLoaderVue = vueWithModule.use(loaderName).loader(loaderName);
        const curLoader = cssWithModule.use(loaderName).loader(loaderName);
        if (loaderOpts && Object.keys(loaderOpts).length) {
            curLoaderVue.options(loaderOpts).end();
            curLoader.options(loaderOpts).end();
        } else {
            curLoaderVue.end();
            curLoader.end();
        }
    });

    // config basic css
    const vueNormal = conf.module
        .rule('css')
        .test(/\.css$/i)
        .oneOf('vue')
        .resourceQuery(/\?vue/);

    const cssNormal = conf.module
        .rule('css')
        .test(/\.css$/i)
        .oneOf('css-normal');

    const { baseStyleUse: cssNormalConf } = createPreStyleConf('css', {
        isDev,
        sourceMap,
        isCssModule: false,
    });

    cssNormalConf.forEach(({ loader: loaderName, options: loaderOpts }) => {
        const curLoaderVue = vueNormal.use(loaderName).loader(loaderName);
        const curLoader = cssNormal.use(loaderName).loader(loaderName);
        if (loaderOpts && Object.keys(loaderOpts).length) {
            curLoaderVue.options(loaderOpts).end();
            curLoader.options(loaderOpts).end();
        } else {
            curLoaderVue.end();
            curLoader.end();
        }
    });

    if (styleType !== 'css') {
        // with css-module
        const { baseStyleUse: moduleStyleUse, regex } = createPreStyleConf(styleType, {
            isDev,
            sourceMap,
            isCssModule: true,
        });

        // config with module
        const vuePreWithModule = conf.module
            .rule(styleType)
            .test(regex)
            .oneOf('vue-modules')
            .resourceQuery(/module/);

        const preWithModule = conf.module
            .rule(styleType)
            .test(regex)
            .oneOf('css-module')
            .test(/\.module\.\w+$/i);

        moduleStyleUse.forEach(({ loader: loaderName, options: loaderOpts }) => {
            const curLoaderVue = vuePreWithModule.use(loaderName).loader(loaderName);
            const curLoader = preWithModule.use(loaderName).loader(loaderName);
            if (loaderOpts && Object.keys(loaderOpts).length) {
                curLoaderVue.options(loaderOpts).end();
                curLoader.options(loaderOpts).end();
            } else {
                curLoaderVue.end();
                curLoader.end();
            }
        });

        // config normal
        const vueNormal = conf.module.rule(styleType).test(regex).oneOf('vue').resourceQuery(/\?vue/);
        const preNormal = conf.module.rule(styleType).test(regex).oneOf('css-normal');

        // without css-module
        const { baseStyleUse: normalStyleUse } = createPreStyleConf(styleType, {
            isDev,
            sourceMap,
            isCssModule: false,
        });

        normalStyleUse.forEach(({ loader: loaderName, options: loaderOpts }) => {
            const curLoaderVue = vueNormal.use(loaderName).loader(loaderName);
            const curLoader = preNormal.use(loaderName).loader(loaderName);
            if (loaderOpts && Object.keys(loaderOpts).length) {
                curLoaderVue.options(loaderOpts).end();
                curLoader.options(loaderOpts).end();
            } else {
                curLoaderVue.end();
                curLoader.end();
            }
        });
    }

    return conf;
}
