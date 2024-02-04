const { resolve: pathResolve } = require('path');
const deepFreeze = require('deep-freeze-strict');
const { createEntry, createLoaders, createPlugins, createDevServerConf } = require('./hooks');
const { extensions } = require('./GlobalConf');

const webpackBaseConfig = deepFreeze({
    // 파일을 읽어들이기 시작하는 진입점 설정
    entry: createEntry(),

    resolve: {
        // 경로에서 확장자 생략 설정
        extensions,
        // 경로 별칭 설정
        alias: {
            '@': pathResolve(__dirname, '../../src'),
        },
    },

    // 결과물(번들)을 반환하는 설정
    output: {
        // 주석은 기본값!, `__dirname`은 현재 파일의 위치를 알려주는 NodeJS 전역 변수
        path: pathResolve(__dirname, '../../dist'),
        filename: '[name].[contenthash].bundle.js',
        clean: true,
    },

    // 모듈 처리 방식을 설정
    module: {
        rules: createLoaders().getConfigOfLoaders(),
    },

    // 번들링 후 결과물의 처리 방식 등 다양한 플러그인들을 설정
    plugins: createPlugins().getPluginConfig(),

    // 개발 서버 옵션
    devServer: createDevServerConf(),
});

module.exports = {
    webpackBaseConfig,
};
