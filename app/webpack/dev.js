//本地启动开发服务器
const express = require('express');
const path = require('path');
const consoler = require('consoler');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { webpackConfig, devServerConfig } = require('./config/webpack.dev.js');

const app = express();
const compiler = webpack(webpackConfig);
//指定静态资源目录
app.use(express.static(path.join(__dirname, '../public/dist')));

app.use(webpackDevMiddleware(compiler, {
    //落地文件
    writeToDisk: (filename) => filename.endsWith('.tpl'),
    //资源路径
    publicPath: webpackConfig.output.publicPath,
    //headers
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization' },
    // logLevel: 'silent',
    stats: {
        colors: true
    }
}));

app.use(webpackHotMiddleware(compiler, {
    path: `/${devServerConfig.HMR_PATH}`,
    log: () => { },
}));


consoler.info('请等待webpack初次构建完成提示...');

const port = devServerConfig.PORT;

app.listen(port, () => {
    console.log(`app is listening at http://${devServerConfig.HOST}:${port}`)
});

