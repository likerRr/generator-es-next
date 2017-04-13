import path from 'path';

module.exports = {
  context: __dirname,
  entry: {
    bundle: './index.js'
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: [
            ['env', {
              modules: false,
              targets: {
                browsers: [ // TODO apply this only if environment is browser
                  'last 2 versions'
                ],
                node: 6.9 // TODO apply this only if environment is node (processed by webpack)
              }
            }]
          ],
          babelrc: false
        }
      }
    ]
  }
};
