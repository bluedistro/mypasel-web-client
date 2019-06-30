// vue.config.js

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
  // devServer: {
  //   proxy: {
  //     "/*": {
  //       target: "https://api.desymal.com",
  //       secure: false
  //     }
  //   }
  // },
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin()]
  }
};
