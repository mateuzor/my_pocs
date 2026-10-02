const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Webpack: bundles everything up front, even in dev, so cold start grows with
// app size. Nothing is implicit: loaders, resolve and HTML must be declared.
module.exports = (env, argv) => ({
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist-webpack'),
    filename: '[name].[contenthash:8].js',
    clean: true,
  },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        // transpileOnly skips type-checking so the timing compares bundling, not tsc.
        use: { loader: 'ts-loader', options: { transpileOnly: true } },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: './templates/webpack.html' })],
  devtool: argv.mode === 'production' ? false : 'eval-cheap-module-source-map',
  devServer: { port: 5172, hot: true },
});
