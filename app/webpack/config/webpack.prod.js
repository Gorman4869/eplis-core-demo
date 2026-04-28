const webpackMerge = require("webpack-merge");
const webpackBaseConfig = require("./webpack.base.js");
const path = require("path");
const os = require("os");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const cleanWebpackPlugin = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackInjectPlugin = require("html-webpack-inject-attributes-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const threadLoaderOptions = {
    workers: os.cpus().length - 1,
    workerParallelJobs: 50,
    poolTimeout: 2000,
};

const webpackConfig = webpackMerge.smart(webpackBaseConfig, {
    mode: "production",
    //输出配置
    output: {
        filename: "js/[name]_[chunkhash:8].bundle.js",
        path: path.resolve(process.cwd(), "./app/public/dist/prod"),
        publicPath: "/dist/prod",
        crossOriginLoading: "anonymous",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "thread-loader",
                        options: threadLoaderOptions,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                        },
                    }
                ],
            },
            {
                test: /\.js$/,
                include: path.resolve(process.cwd(), "./app/pages"),
                use: [
                    {
                        loader: "thread-loader",
                        options: threadLoaderOptions,
                    },
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                            cacheDirectory: true, // babel 自身缓存
                            cacheCompression: false, // babel 缓存压缩
                            plugins: ["@babel/plugin-transform-runtime"],

                        },
                    }
                ],
            },
        ],
    },
    performance: {
        hints: false,
    },
    plugins: [
        //每次build之前删除public/dist/目录
        new cleanWebpackPlugin(
            ["public/dist"],
            {
                root: path.resolve(process.cwd(), "./app/"),
                exclude: [],
                allowEmpty: true,
                verbose: true,
                dry: false
            }
        ),
        //提取公共部分css，有效利用缓存
        new MiniCssExtractPlugin({
            filename: "css/[name]_[contenthash:8].bundle.css",
            chunkFilename: "css/[name]_[contenthash:8].bundle.css",
        }),
        //优化并压缩Css
        new CssMinimizerPlugin({
            parallel: 4,
        }),

        //浏览器请求资源时不发送用户身份认证
        new HtmlWebpackInjectPlugin({
            crossOrigin: "anonymous",
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserWebpackPlugin(
            {
                parallel: true, // 使用多线程压缩
                cache: true, // 使用缓存加速构建
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                    },
                },
            }
        )],
    },
});

module.exports = webpackConfig;
