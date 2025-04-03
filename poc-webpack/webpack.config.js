const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js", // Webpack entry point
  output: {
    filename: "bundle.js", // Output bundled file
    path: path.resolve(__dirname, "dist"),
    clean: true, // Cleans old files
  },
  mode: "development",
  devServer: {
    static: "./dist",
    hot: true, // Enables live reload
    historyApiFallback: true, // Enables SPA routing
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Ensures correct HTML file is used
      filename: "index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"], // Processes CSS files
      },
    ],
  },
};
