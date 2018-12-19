const webpack = require('webpack');
const Config = require('../config/config');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  entry: {
    candy: ['babel-polyfill','./src/candypc.js']
  },
  devtool: 'inline-source-map',
  devServer: {
    compress: true,
    port: Config.frontend.port+2,
    host: Config.frontend.host,
    hot: true,
    historyApiFallback: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'candy.html',
      favicon: 'favicon.ico',
      inject: true,
      excludeChunks: ['admin','app']
    })
  ],
  mode: 'development'
});
