const path = require('path')
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const isProd = process.env.NODE_ENV === 'production'
const startAnalyzer = process.env.ANALYZER === 'true'
const devtool = isProd ? false : 'source-map'
const minimizer = []
const basePlugin = []
const baseRules = []

if (startAnalyzer) {
  basePlugin.push(new BundleAnalyzerPlugin())
}

if (isProd) {
  minimizer.push(
    new ESBuildMinifyPlugin({
      target: 'es2015',
    }),
    new TerserPlugin(),
  )
  baseRules.push({
    test: /\.tsx?$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'esbuild-loader',
      options: {
        loader: 'tsx',
        target: 'es2015',
        // tsconfigRaw: require('./tsconfig.json'),
      },
    },
  })
} else {
  baseRules.push({
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
  })
}

module.exports = {
  mode: process.env.NODE_ENV,
  devtool,
  entry: './src/index.tsx',
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].[chunkhash:8].chunk.js',
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
    ...basePlugin,
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  module: {
    rules: [...baseRules],
  },
  optimization: {
    minimizer,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          priority: -1,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: -99,
        },
      },
    },
  },
  devServer: {
    historyApiFallback: true,
  },
}
