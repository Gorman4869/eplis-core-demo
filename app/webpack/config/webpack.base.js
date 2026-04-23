const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const htmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "production",
  //入口配置
  entry: {
    "entry.page1": "./app/pages/page1/entry1.js",
    "entry.page2": "./app/pages/page2/entry2.js",
  },
  //模块配置,解析规则(决定了要加载解析哪些模块，以及用什么方式去解析)
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
        },
      }, {
        test: /\.js$/,
        include: [
          // 匹配app/pages目录下的所有js文件
          path.resolve(process.cwd(), "./app/pages"),
        ],
        use: {
          loader: "babel-loader",
        },
      }, {
        test: /\.(png|jpg|jpe?g|gif)(\?.*)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 300,
            esModule: false,
          },
        },
      }, {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
        ],
      }, {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      }, {
        test: /\.(woff|woff2|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name]_[hash:8].[ext]",
          },
        },
      }
    ]
  },
  //输出配置
  output: {
    filename: 'js/[name]_[chunkhash:8].bundle.js',
    path: path.resolve(process.cwd(), './app/public/dist/prod'),
    publicPath: "/dist/prod",
    crossOriginLoading: "anonymous",
  },
  //配置模块的具体行为,决定在打包时，如何找到并解析模块。类似path.resolve
  resolve: {
    extensions: [".js", ".vue", ".less", ".css"],
    alias: {
      "@": path.resolve(process.cwd(), "./app"),
    },
  },
  //插件配置
  plugins: [
    //作用：使vue-loader正常工作,使vue文件中的<script></script>标签中的代码能被babel-loader解析
    new VueLoaderPlugin(),
    //作用：把第三方库暴露给window对象
    new webpack.ProvidePlugin({
      Vue: "vue",
    }),
    //定义全局常量
    new webpack.DefinePlugin({
      __VUE_PROD_DEVTOOLS__: 'false', // 禁用生产模式下devtools
      __VUE_OPTIONS_API__: 'true', // 支持选项API
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false', // 禁用生产显示hydration mismatch的详细信息（水合）
    }),
    //生成html文件
    new htmlWebpackPlugin({
      // 输出的文件名
      filename: path.resolve(process.cwd(), "./app/public/dist/", "entry.page1.tpl"),
      // 模板文件
      template: path.resolve(process.cwd(), "./app/view", "entry.tpl"),
      //要注入的代码块，即要包含的js文件
      chunks: ["entry.page1"],
    }),
    new htmlWebpackPlugin({
      // 输出的文件名
      filename: path.resolve(process.cwd(), "./app/public/dist/", "entry.page2.tpl"),
      // 模板文件
      template: path.resolve(process.cwd(), "./app/view", "entry.tpl"),
      //要注入的代码块，即要包含的js文件
      chunks: ["entry.page2"],
    }),
  ],
  //配置打包输出优化，压缩，缓存，树摇等
  optimization: {},
};
