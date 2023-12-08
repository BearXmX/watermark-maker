const path = require('path')

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 配置src别名
    },
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.output = {
        ...webpackConfig.output,
        publicPath: process.env.NODE_ENV === 'development' ? '/' : './',

      }

      webpackConfig.devtool = webpackConfig.mode === "production" ? false : 'inline-source-map';

      return webpackConfig
    }
  }
}