// path: NodeJS에서 파일 및 디렉토리 경로 작업을 위한 전역 모듈
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const { useLoadStyleConf } = require('./UseLoaders');
const { useHtmlPlugin, useCopyPlugin } = require('./UsePlugins');
const { extensions } = require('./GlobalConf');

const webpackBaseConfig = {
    // 파일을 읽어들이기 시작하는 진입점 설정
    entry: {
        index: [path.resolve(__dirname, '../../src/main.ts')],
    },

    resolve: {
        // 경로에서 확장자 생략 설정
        extensions,
        // 경로 별칭 설정
        alias: {
            '@': path.resolve(__dirname, '../../src'),
        },
    },

    // 결과물(번들)을 반환하는 설정
    output: {
        // 주석은 기본값!, `__dirname`은 현재 파일의 위치를 알려주는 NodeJS 전역 변수
        path: path.resolve(__dirname, '../../dist'),
        // filename: 'main.js',
        clean: true,
    },

    // 모듈 처리 방식을 설정
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.vue$/,
                resourceQuery: /type=style/,
                sideEffects: true,
            },
            useLoadStyleConf(),
            useLoadStyleConf({
                styleType: 'scss',
            }),
            useLoadStyleConf({
                styleType: 'sass',
            }),
            {
                test: /\.[jt]s$/,
                exclude: /node_modules/, // 제외할 경로
                use: ['babel-loader'],
            },
            // add typescript
            {
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
            {
                test: /\.(png|jpe?g|gif|webp)$/,
                type: 'asset/resource',
            },
            {
                test: /\.(woff2?|eot|[ot]tf)$/i,
                type: 'asset/resource',
            },
        ],
    },

    // 번들링 후 결과물의 처리 방식 등 다양한 플러그인들을 설정
    plugins: [useHtmlPlugin(), useCopyPlugin(), new VueLoaderPlugin()],

    // 개발 서버 옵션
    devServer: {
        host: 'localhost',
        port: 6060,
        hot: true,
    },
};

module.exports = {
    webpackBaseConfig,
};
