const webpack = require('webpack');
const Config = require('../config/config');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  entry: {
    app: ['babel-polyfill','./src/index.js']
  },
  devtool: 'inline-source-map',
  devServer: {
    compress: true,
    port: Config.frontend.port,
    host: Config.frontend.host,
    hot: true,
    historyApiFallback: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      favicon: 'favicon.ico',
      inject: true,
      excludeChunks: ['admin']
    })
  ],
  mode: 'development'
});