const path = require('path')
const config = require('./webpack.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = Object.assign({}, config, {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    index: './src/index.tsx'
  },
  output: {
    ...config.output,
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Yusuke Shibata',
      template: '!!prerender-loader?string!index.html'
    }),
    new ForkTsCheckerWebpackPlugin()
  ]
})

