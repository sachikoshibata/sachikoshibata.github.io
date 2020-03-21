const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  entry: {
    index: './src/index.tsx'
  },
  devServer: {
    port: 4000,
    contentBase: path.resolve('public'),
    historyApiFallback: true
  },
  output: {
    filename: '[hash].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    pathinfo: false
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        loader: 'eslint-loader'
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: [
          path.resolve(__dirname, 'src')
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true
        }
      },
      {
        test: /\.(css|svg|gif|png|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Sachiko Shibata',
      template: 'index.html'
    }),
    new ForkTsCheckerWebpackPlugin()
  ]
}
