const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  output: {
    filename: '[name].[hash].js',
    publicPath: "/",
    path: path.resolve(__dirname, '../dist'),
    libraryTarget: 'umd'
  },
  externals: {},
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        include: path.resolve(__dirname, "../src"),
        loader: 'babel-loader',
        query: {
          plugins: [
            'transform-decorators-legacy',
            "syntax-dynamic-import",
            ["import",
              [{ "libraryName": "antd", "style": true }, { "libraryName": "antd-mobile", "style": true }]
            ]
          ],
          presets: ['es2015', 'stage-0', 'react'],
          cacheDirectory: true
        }
      },
      {
        test: /\.(css|less)$/,
        use: [
          'style-loader',
          'css-loader',
          { loader: 'less-loader', options: { javascriptEnabled: true }}
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader:'url-loader',
          options:{limit:8192}
        }

        ]
      },
      {
         test: /\.(woff|woff2|eot|ttf|otf)$/,
         use: [
           'file-loader'
         ]
      },
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    }
  },
  plugins: [
    new CleanWebpackPlugin('dist', {
      root: path.resolve(__dirname, '..')
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        // 打包不同入口的公共代码
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2
        }
      }
    }
  },
  mode: 'development'
};