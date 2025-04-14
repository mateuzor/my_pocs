// Import required Node.js modules
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "development",

  // Output configuration
  output: {
    filename: "bundle.js", // Output bundle filename
    path: path.resolve(__dirname, "dist"), // Output directory path
    clean: true, // Clean the dist folder before each build
    publicPath: "/", // Base path for all assets
  },

  // Webpack dev server configuration
  devServer: {
    static: "./public", // Directory to serve static files from
    port: 3003, // Port number to run the dev server
    hot: true, // Enable hot module replacement
  },

  // Module rules for different file types
  module: {
    rules: [
      {
        test: /\.js$/, // Apply this rule to .js files
        exclude: /node_modules/, // Ignore node_modules folder
        use: "babel-loader", // Use babel-loader to transpile JavaScript
      },
    ],
  },

  // Plugins used in the build process
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new Dotenv(), // loads variables from .env
  ],
};
