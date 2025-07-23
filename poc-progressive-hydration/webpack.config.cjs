const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const WebpackBar = require("webpackbar");

const baseConfig = {
  context: __dirname,
  devtool: "cheap-source-map",
  mode: "production",
  stats: {
    all: false,
    warnings: true,
    errors: true,
    errorDetails: true,
  },
  output: {
    filename: "main.js",
    chunkFilename: "[name].[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          generatorOpts: {
            retainLines: true,
            compact: true,
          },
        },
      },
    ],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};

// webpack.config.cjs
module.exports = (_, env) => [
  merge(baseConfig, {
    name: "server",
    target: "node",
    context: __dirname,
    entry: path.resolve(__dirname, "server.js"),
    optimization: {
      minimize: false,
    },
    output: {
      path: path.resolve(__dirname, "build", "ssr"),
      libraryExport: "default",
      libraryTarget: "commonjs2",
    },
    plugins: [
      new webpack.DefinePlugin({
        "typeof window": '"undefined"',
        "typeof document": '"undefined"',
      }),
      new WebpackBar({ name: "server" }),
    ],
  }),
  merge(baseConfig, {
    name: "client",
    context: __dirname,
    entry: path.resolve(__dirname, "src/client.js"),
    output: {
      filename: "client.js",
      path: path.resolve(__dirname, "build"),
      publicPath: "/build/",
    },
    plugins: [
      new webpack.DefinePlugin({
        "typeof window": '"object"',
        "typeof document": '"object"',
      }),
      new WebpackBar({ name: "client" }),
    ],
  }),
];
