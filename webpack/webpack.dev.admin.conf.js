const webpack = require('webpack');
const Config = require('../config/config');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  entry: {
    admin: ['babel-polyfill','./src/admin.js']
  },
  devtool: 'inline-source-map',
  devServer: {
    compress: true,
    port: Config.frontend.port+1,
    host: Config.frontend.host,
    hot: true,
    historyApiFallback: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'admin.html',
      favicon: 'favicon.ico',
      inject: true,
      excludeChunks: ['app']
    })
  ],
  mode: 'development'
});
