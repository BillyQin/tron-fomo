const webpack = require('webpack');
const Config = require('../config/config');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  entry: {
    app: ['babel-polyfill','./src/index.js'],
    admin: ['babel-polyfill','./src/admin.js'],
    candy: ['babel-polyfill','./src/candypc.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'admin.html',
      template: 'admin.html',
      favicon: 'favicon.ico',
      inject: true,
      excludeChunks: ['app','candypc']
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      favicon: 'favicon.ico',
      inject: true,
      excludeChunks: ['admin','candypc']
    }),
    new HtmlWebpackPlugin({
      filename: 'candy.html',
      template: 'candy.html',
      favicon: 'favicon.ico',
      inject: true,
      excludeChunks: ['admin','app']
    })
  ],
  mode: 'production'
});
