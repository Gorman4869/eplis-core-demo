const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const htmlWebpackPlugin = require("html-webpack-plugin");

const glob = require("glob");


// 自动获取entry入口配置
const entry = {};
// 自动获取entry入口配置的html插件
const entryHtmlPlugins = [];
// 自动获取entry入口配置的文件列表
const entryList = glob.sync(path.resolve(process.cwd(), "./app/pages/**/entry.*.js"));
entryList.forEach((entryPath) => {
  const entryName = path.basename(entryPath, '.js');
  entry[entryName] = entryPath;
  entryHtmlPlugins.push(
    new htmlWebpackPlugin({
      filename: path.resolve(
        process.cwd(),
        "./app/public/dist/",
        `${entryName}.tpl`,
      ),
      template: path.resolve(process.cwd(), "./app/view", "entry.tpl"),
      chunks: [entryName],
    }),
  );
});


module.exports = {
  mode: "production",
  //入口配置
  entry: entry,
  //模块配置,解析规则(决定了要加载解析哪些模块，以及用什么方式去解析)
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
        },
      },
      {
        test: /\.js$/,
        include: [
          // 匹配app/pages目录下的所有js文件
          path.resolve(process.cwd(), "./app/pages"),
        ],
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpg|jpe?g|gif)(\?.*)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 300,
            esModule: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name]_[hash:8].[ext]",
          },
        },
      },
    ],
  },
  //输出配置
  output: {
  },
  //配置模块的具体行为,决定在打包时，如何找到并解析模块。类似path.resolve
  resolve: {
    extensions: [".js", ".vue", ".less", ".css"],
    alias: {
      "@": path.resolve(process.cwd(), "./app"),
      "$pages": path.resolve(process.cwd(), "./app/pages"),
      "$common": path.resolve(process.cwd(), "./app/pages/common"),
      "$widgets": path.resolve(process.cwd(), "./app/pages/widgets"),
      "$store": path.resolve(process.cwd(), "./app/pages/store"),
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
      __VUE_PROD_DEVTOOLS__: "false", // 禁用生产模式下devtools
      __VUE_OPTIONS_API__: "true", // 支持选项API
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false", // 禁用生产显示hydration mismatch的详细信息（水合）
    }),
    //生成html文件
    ...entryHtmlPlugins,

  ],
  //配置打包输出优化，压缩，缓存，树摇等
  optimization: {
    splitChunks: {
      chunks: "all",// 默认值，表示对同步和异步的chunk都进行分割
      maxAsyncRequests: 10, // 最大异步请求数
      maxInitialRequests: 3,//入口点的最大并行请求数
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          priority: 20,
          reuseExistingChunk: true,// 是否重用已存在的chunk
          enforce: true,// 强制打包
        },
        common: {
          name: "common",
          minChunks: 2,//最小被引用次数
          minSize: 1,//最小分割文件大小
          priority: 10,
          reuseExistingChunk: true,
        },
      },
    },
    // webpack运行时代码分离出来runtime.js
    runtimeChunk: true,
  },
};
