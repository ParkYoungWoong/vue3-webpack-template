// path: NodeJS에서 파일 및 디렉토리 경로 작업을 위한 전역 모듈
const path = require('path');
const { createEntry, createLoaders, createPlugins, createDevServerConf } = require('./hooks');
const { extensions } = require('./GlobalConf');

const webpackBaseConfig = Object.freeze({
    // 파일을 읽어들이기 시작하는 진입점 설정
    entry: createEntry(),

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
