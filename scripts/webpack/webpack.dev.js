const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')

/** @type {import("webpack").Configuration} */
const config = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  plugins: [new ReactRefreshWebpackPlugin(), new DashboardPlugin()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'swc-loader',
          options: {
            sync: true,
            jsc: {
              parser: {
                syntax: 'typescript',
              },
            },
          },
        },
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    compress: true,
    // http2: true,
  },
}

module.exports = config
