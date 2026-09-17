const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env = {}) => ({
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    // contenthash: filenames change only when content changes (long-term caching).
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    clean: true,
  },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/, options: { transpileOnly: true } }],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),

    // `--env slim`: moment ships ~130 locale files and bundles them all by default.
    // IgnorePlugin drops them at build time; compare the treemap with and without it.
    ...(env.slim ? [new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ })] : []),

    // The analyzer plugin only runs when requested so normal builds stay fast.
    ...(process.env.ANALYZE
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static', // writes dist/report.html instead of starting a server
            reportFilename: env.slim ? 'report-slim.html' : 'report.html',
            openAnalyzer: false,
            defaultSizes: 'gzip', // gzip is what users actually download
          }),
        ]
      : []),
  ],
  optimization: {
    // Vendor split: React rarely changes, so keeping it in its own chunk improves cache hits.
    splitChunks: {
      cacheGroups: {
        react: { test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/, name: 'react-vendor', chunks: 'all' },
      },
    },
  },
  // Default performance hints warn when assets pass 244 KiB: a built-in size budget.
  performance: { hints: 'warning' },
  devServer: { port: 3000, hot: true, historyApiFallback: true },
});
