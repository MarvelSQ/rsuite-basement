const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { registerApp } = require('./server');
/**
 * @type {import('webpack').Configuration & {devServer: import('webpack-dev-server').Configuration}}
 */
module.exports = {
  mode: 'development',
  entry: [
    'react-refresh/runtime',
    path.resolve(__dirname, './src/dev/index.tsx'),
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },
  resolve: {
    mainFields: ['main'],
    extensions: ['.json', '.ts', '.tsx', '.js'],
  },
  devServer: {
    port: 2021,
    before(app) {
      registerApp(app);
    },
    hot: true,
    injectClient: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.less/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {},
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      inject: 'body',
    }),
  ],
};
