const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/myReact.js",
  mode: "development",
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3001,
  },
  output: {
    publicPath: "auto",
    clean: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "myReactLib",
      filename: "remoteEntry.js",
      exposes: {
        "./MyReact": "./src/myReact.js",
      },
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
};
