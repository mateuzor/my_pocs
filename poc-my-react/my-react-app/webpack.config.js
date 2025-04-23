const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3002,
  },
  output: {
    publicPath: 'auto',
    clean: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'myReactApp',
      remotes: {
        myReactLib: 'myReactLib@http://localhost:3001/remoteEntry.js',
      },
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
};
