const useLoaders = require('../../UseLoaders');
const { useLoadStyleConf } = useLoaders;

// base config
const baseLoaderRules = Object.freeze({
    vue: {
        test: /\.vue$/,
        use: 'vue-loader',
    },
    vueStyle: {
        test: /\.vue$/,
        resourceQuery: /type=style/,
        sideEffects: true,
    },
    css: useLoadStyleConf(),
    scss: useLoadStyleConf({
        styleType: 'scss',
    }),
    sass: useLoadStyleConf({
        styleType: 'sass',
    }),
    jsAndTs: {
        test: /\.[jt]s$/,
        exclude: /node_modules/, // 제외할 경로
        use: ['babel-loader'],
    },
    // add typescript
    ts: {
        test: /\.ts$/,
        exclude: /node_modules/, // 제외할 경로
        use: [
            {
                loader: 'babel-loader',
            },
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    happyPackMode: false,
                    appendTsxSuffixTo: ['\\.vue$'],
                },
            },
        ],
    },
    pics: {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: 'asset/resource',
        parser: {
            dataUrlCondition: {
                maxSize: 10 * 1024,
            },
        },
    },
    fonts: {
        test: /\.(woff2?|eot|[ot]tf)$/i,
        type: 'asset/resource',
    },
});

/**
 * @description A hook to create loader config
 * @param {Record<string, unknown>} yourConfig Your loader conf
 * @returns three functions to create loader conf
 */
const createLoaders = (yourConfig = {}) => {
    let res = Object.assign(Object.create(null), { ...baseLoaderRules }, yourConfig);

    /** @description get all loaders having been added */
    const getAllLoadersByName = () => Object.keys(res);

    /** @description use this function to get the configuration of the loader given name */
    const getOneLoaderConfig = loaderName => {
        if (getAllLoadersByName().includes(loaderName)) {
            return Object.freeze(Object.assign(Object.create(null), res[loaderName]));
        }

        return null;
    };

    /** @description get all loaders having been added by key-value */
    const getAllLoaderConfig = () => Object.freeze(Object.assign(Object.create(null), res));

    /** @description use this function to config a loader or add a loader */
    const configOneLoader = (key, opt) => {
        res = Object.assign(res, {
            [key]: opt,
        });
    };

    /** @description get the result of loader config */
    const getConfigOfLoaders = () => Object.values(res);

    return {
        getAllLoadersByName,
        getOneLoaderConfig,
        getAllLoaderConfig,
        configOneLoader,
        getConfigOfLoaders,
    };
};

module.exports = createLoaders;
