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
                browsers: [
                  'last 2 versions'
                ],
                node: 6.9
              }
            }]
          ],
          babelrc: false
        }
      }
    ]
  }
};
