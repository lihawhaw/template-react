const path = require('path')
const webpack = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const { merge } = require('webpack-merge')
const productionConfig = require('./scripts/webpack/webpack.prod')
const developmentConfig = require('./scripts/webpack/webpack.dev')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const smp = new SpeedMeasurePlugin()
const NODE_ENV = process.env.NODE_ENV
const CUSTOM_PUBLIC_PATH = process.env.PUBLIC_PATH
const startAnalyzer = process.env.ANALYZER === 'true'
const isSped = process.env.SPEED === 'true'
const developmentEnv = 'development'
const productionEnv = 'production'
const isProd = NODE_ENV === productionEnv
const publicPath = isProd ? CUSTOM_PUBLIC_PATH : '/'

const basePlugin = []

if (startAnalyzer) {
  basePlugin.push(new BundleAnalyzerPlugin())
}

/**
 * @type {import("webpack").Configuration}
 */
const commonConfig = {
  entry: './src/index.tsx',
  output: {
    publicPath,
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[name][ext]',
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
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                auto: true,
                exportGlobals: true,
                localIdentName: '[path][name]__[local]--[contenthash:base64:5]',
                localIdentContext: path.resolve(__dirname, 'src'),
                localIdentHashSalt: 'hash',
                namedExport: true,
                exportLocalsConvention: 'camelCase',
                exportOnlyLocals: false,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: 'asset',
      },
    ],
    // parser: {
    //   javascript: {
    //     wrappedContextRegExp: /.*/,
    //     wrappedContextRecursive: true,
    //   },
    // },
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      __BASENAME__: JSON.stringify(process.env.BASENAME),
    }),
    ...basePlugin,
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
  devServer: {
    historyApiFallback: true,
    compress: true,
  },
}

const mergedProductionConfig = merge(commonConfig, productionConfig)
module.exports = (env, args) => {
  switch (NODE_ENV) {
    case developmentEnv:
      return merge(commonConfig, developmentConfig)
    case productionEnv:
      if (isSped) return smp.wrap(mergedProductionConfig)
      return mergedProductionConfig
    default:
      throw new Error('No matching configuration was found!')
  }
}
