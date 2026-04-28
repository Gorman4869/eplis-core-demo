
const webpackMerge = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");
const webpackBaseConfig = require("./webpack.base.js");

//devServer配置
const DEV_SERVER_CONFIG = {
    HOST: "127.0.0.1",
    PORT: 8080,
    HMR_PATH: "__webpack_hmr",//官方规定
    TIMEOUT: 20000
}

//开发阶段的entry配置需要加入hmr
Object.keys(webpackBaseConfig.entry).forEach(entryName => {
    if (entryName !== 'vendor') {
        webpackBaseConfig.entry[entryName] = [webpackBaseConfig.entry[entryName], `webpack-hot-middleware/client?path=http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/${DEV_SERVER_CONFIG.HMR_PATH}&timeout=${DEV_SERVER_CONFIG.TIMEOUT}&reload=true`];
    }
});

const webpackConfig = webpackMerge.smart(webpackBaseConfig, {
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    //输出配置
    output: {
        filename: "js/[name]_[chunkhash:8].bundle.js",
        path: path.resolve(process.cwd(), "./app/public/dist/dev"),//开发阶段的输出路径
        publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev/`,//开发阶段的publicPath
        globalObject: "this",
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin({ multiStep: false }),
    ],
});


module.exports = {
    // webpack配置
    webpackConfig,
    // devServer配置
    devServerConfig: DEV_SERVER_CONFIG
};
