const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

/** @type {import("webpack").Configuration} */
const config = {
  mode: 'production',
  devtool: false,
  output: {
    chunkFilename: '[name].[chunkhash].chunk.js',
    filename: '[name].[contenthash].bundle.js',
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css',
      // ignoreOrder: true,
    }),
    new CssMinimizerPlugin(),
  ],
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
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic', // 'deterministic' 'named'
    sideEffects: true, // 开启sideEffects
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.swcMinify,
        terserOptions: {
          //
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: 'react',
          priority: -1,
        },
        routerVendor: {
          test: /[\\/]node_modules[\\/](react-router|react-router-dom|history|@loadable|@babel|react-is|hoist-non-react-statics|@remix-run)[\\/]/,
          name: 'router',
          priority: -2,
        },
        ohterVendor: {
          test: /node_modules/,
          name: 'ohter',
          priority: -99,
        },
        // vendor: {
        //   test: /[\\/]node_modules[\\/]/,
        //   name(module) {
        //     const packageName = module.context.match(
        //       /[\\/]node_modules[\\/].pnpm[\\/](.*?)([\\/]|$)/,
        //     )[1]
        //     return `${packageName.replace('@', '_')}`
        //   },
        //   priority: -10,
        // },
      },
    },
  },
  devServer: {
    historyApiFallback: true,
    compress: true,
    // http2: true,
  },
}

module.exports = config
