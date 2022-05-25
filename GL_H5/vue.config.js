const webpack = require("webpack");
module.exports = {
  publicPath: process.env.VUE_APP_NODE_PATH, // == 'uat'?'/cf-trade/':process.env.NODE_TITLE != 'production'?'/':'https://static.skhwg.com/',
  outputDir: process.env.VUE_APP_NODE_OUTPUT_DIR || "cf-trade",
  lintOnSave: false,
  productionSourceMap: false, // process.env.NODE_ENV == 'development',
  // devtool:process.env.NODE_ENV == 'development'?'cheap-module-eval-source-map':'cheap-module-source-map',
  chainWebpack: (config) => {
    // console.log(config,'chainWebpack')
    // 移除 prefetch 插件
    config.plugins.delete("prefetch");
    // 移除 preload 插件
    config.plugins.delete("preload");
    config.devtool =
      process.env.NODE_ENV == "development"
        ? "cheap-module-eval-source-map"
        : "cheap-module-source-map";
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap((options) => {
        options.limit = -1;
        return options;
      });
  },
  configureWebpack: {
    // 关闭 webpack 的性能提示
    performance: {
      hints: false,
    },
    // 警告 webpack 的性能提示
    /*  performance: {
              hints:'warning',
              //入口起点的最大体积
              maxEntrypointSize: 50000000,
              //生成文件的最大体积
              maxAssetSize: 30000000,
              //只给出 js 文件的性能提示
              assetFilter: function(assetFilename) {
                  return assetFilename.endsWith('.js');
              }
          }*/
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery",
      }),
    ],
  },
  devServer: {
    overlay: {
      warnings: false,
      errors: false,
    },
    proxy: {
      "/webui": {
        target: "http://trader.will68.com/",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/webui": "/webui",
        },
      },
    },
  },
};
