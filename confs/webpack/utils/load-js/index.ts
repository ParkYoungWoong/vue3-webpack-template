import Config from 'webpack-chain';

/** @description basic config of ts-loader */
const tsLoaderBasicConf = {
    transpileOnly: true,
    happyPackMode: true,
};

/** @description Options when config js/ts loading */
type LoadJsOptions = Partial<{
    /** is at prod environment */
    isProd: boolean;
    /** is using TypeScript */
    isTypeScript: boolean;
    /** babel only compile, which is more important than `notCompiles` */
    onlyCompiles: (string | RegExp)[];
    /** babel not compile */
    notCompiles: (string | RegExp)[];
}>;

/**
 * @description add thread loader when isProd
 * @param confInstance the webpack chain config instance
 * @param opts other options of this function
 */
export function loadJs(confInstance: Config, opts: LoadJsOptions = {}): Config {
    const { isProd, isTypeScript = true, onlyCompiles = [], notCompiles = [/node_modules/] } = opts || {};

    // Configuration only at production environment
    if (isProd) {
        const baseConf = confInstance.module
            .rule('js')
            .test(/\.jsx?$/i)
            .use('thread-loader')
            .loader('thread-loader')
            .end()
            .use('babel')
            .loader('babel-loader')
            .options({ babelrc: true })
            .end()
            .end();

        const jsRule = baseConf.rule('js');
        // add only compiles
        if (onlyCompiles && onlyCompiles.length) {
            onlyCompiles.forEach(item => {
                jsRule.include.add(item);
            });
        }
        // add not compiles
        if (notCompiles.length) {
            if (!onlyCompiles || !onlyCompiles.length) {
                notCompiles.forEach(item => {
                    jsRule.exclude.add(item);
                });
            }
        }

        if (isTypeScript) {
            const tsConf = baseConf
                .rule('ts')
                .test(/\.tsx?$/i)
                .use('thread-loader')
                .loader('thread-loader')
                .end()
                .use('babel')
                .loader('babel-loader')
                .options({ babelrc: true })
                .end()
                .use('ts-loader')
                .loader('ts-loader')
                .options(tsLoaderBasicConf)
                .end()
                .end();

            const tsRule = tsConf.rule('ts');
            // add only compiles
            if (onlyCompiles && onlyCompiles.length) {
                onlyCompiles.forEach(item => {
                    tsRule.include.add(item);
                });
            }

            // add not compiles
            if (notCompiles.length) {
                if (!onlyCompiles || !onlyCompiles.length) {
                    notCompiles.forEach(item => {
                        tsRule.exclude.add(item);
                    });
                }
            }

            return tsConf.end();
        }

        return baseConf.end();
    }

    const baseConf = confInstance.module
        .rule('js')
        .test(/\.jsx?$/i)
        .use('babel')
        .loader('babel-loader')
        .options({ babelrc: true })
        .end()
        .end();

    const jsRule = baseConf.rule('js');
    // add only compiles
    if (onlyCompiles && onlyCompiles.length) {
        onlyCompiles.forEach(item => {
            jsRule.include.add(item);
        });
    }
    // add not compiles
    if (notCompiles.length) {
        if (!onlyCompiles || !onlyCompiles.length) {
            notCompiles.forEach(item => {
                jsRule.exclude.add(item);
            });
        }
    }

    if (isTypeScript) {
        const tsConf = baseConf
            .rule('ts')
            .test(/\.tsx?$/i)
            .use('babel')
            .loader('babel-loader')
            .options({ babelrc: true })
            .end()
            .use('ts-loader')
            .loader('ts-loader')
            .options({
                ...tsLoaderBasicConf,
                happyPackMode: false,
            })
            .end()
            .end();

        const tsRule = tsConf.rule('ts');
        // add only compiles
        if (onlyCompiles && onlyCompiles.length) {
            onlyCompiles.forEach(item => {
                tsRule.include.add(item);
            });
        }

        // add not compiles
        if (notCompiles.length) {
            if (!onlyCompiles || !onlyCompiles.length) {
                notCompiles.forEach(item => {
                    tsRule.exclude.add(item);
                });
            }
        }

        return tsConf.end();
    }

    return baseConf.end();
}
