var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client',
    './lib/index'
  ],
  output: {
    filename: 'app.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/assets/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      },
      'CONNECT': `"${process.env.CONNECT? process.env.CONNECT.trim(): 'https://coremedia.app.baqend.com'}"`,
      '__DEVTOOLS__': process.env.DEVTOOLS === 'true' ? true : false
    }),
    new HtmlWebpackPlugin({
      title: 'Redux React Router Async Example',
      filename: 'index.html',
      template: 'index.template.html',
      favicon: path.join(__dirname, 'assets', 'images', 'favicon.ico')
    })
  ],
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader?!cssnext-loader' },
      { test: /\.js$/, loader: 'babel', include: path.join(__dirname, 'lib') },
      { test: /\.png$/, loader: "url-loader?limit=10000" },
      { test: /\.jpg$/, loader: "file-loader" }
    ]
  },
  cssnext: {
    browsers: 'last 2 versions'
  }
};
