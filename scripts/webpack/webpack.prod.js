const TerserPlugin = require('terser-webpack-plugin')

/** @type {import("webpack").Configuration} */
const config = {
  mode: 'production',
  devtool: 'eval-cheap-module-source-map',
  output: {
    chunkFilename: '[name].[chunkhash].chunk.js',
    filename: '[name].[contenthash].bundle.js',
  },
  plugins: [],
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
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/].pnpm[\\/](.*?)([\\/]|$)/,
            )[1]
            return `${packageName.replace('@', '_')}`
          },
          priority: -10,
        },
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
