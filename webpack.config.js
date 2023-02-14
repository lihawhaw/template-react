const path = require('path')
const webpack = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const { merge } = require('webpack-merge')
const productionConfig = require('./scripts/webpack/webpack.prod')
const developmentConfig = require('./scripts/webpack/webpack.dev')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const smp = new SpeedMeasurePlugin()
const NODE_ENV = process.env.NODE_ENV
const isProd = NODE_ENV === 'production'
const startAnalyzer = process.env.ANALYZER === 'true'
const isSped = process.env.SPEED === 'true'
const CUSTOM_PUBLIC_PATH = process.env.PUBLIC_PATH
const basePlugin = []
const publicPath = isProd ? CUSTOM_PUBLIC_PATH : '/'

if (startAnalyzer) {
  basePlugin.push(new BundleAnalyzerPlugin())
}

/** @type {import("webpack").Configuration} */
const commonConfig = {
  entry: './src/index.tsx',
  output: {
    publicPath,
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    ...basePlugin,
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      __BASENAME__: JSON.stringify(process.env.BASENAME),
    }),
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
  devServer: {
    historyApiFallback: true,
    compress: true,
  },
}

module.exports = (env, args) => {
  switch (NODE_ENV) {
    case 'development':
      return merge(commonConfig, developmentConfig)
    case 'production':
      if (isSped) return smp.wrap(merge(commonConfig, productionConfig))
      return merge(commonConfig, productionConfig)
    default:
      throw new Error('No matching configuration was found!')
  }
}
