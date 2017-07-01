const nodeExternals = require('webpack-node-externals')
const path = require('path')
const webpack = require('webpack')

const conf = (name, entry, pathname) => {
  return {
    entry: {
      built: [
        'regenerator-runtime/runtime',
        entry
      ]
    },
    watch: false,
    context: __dirname,
    devtool: 'cheap-module-source-map',
    output: {
      path: path.join(__dirname, pathname),
      filename: `${name}.js`,
      pathinfo: false,
      libraryTarget: 'commonjs2'
    },
    plugins: [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ],
    module:{
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: path.join(__dirname, 'src'),
          enforce: 'pre',
          loader: 'eslint-loader'
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              'es2015',
              'react',
              'stage-1'
            ],
            env: {
              'development': {
                'sourceMaps': 'inline'
              }
            },
            plugins: [
              'transform-regenerator',
              'transform-object-rest-spread',
              'transform-object-assign'
            ]
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.json'],
      modules: ['node_modules']
    },
    node: {
      __dirname: false,
      __filename: false
    },
    target: 'node',
    externals: [ nodeExternals({
      whitelist: [ 'regenerator-runtime/runtime' ]
    }) ]
  }
}

module.exports = [
  conf('jpg-loader', '../src/loaders/jpg-loader', '../loaders')
]
