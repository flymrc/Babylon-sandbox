const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env = {}, options) => {
  const isProduction = options.mode == "production";

  return {
    mode: isProduction ? "production" : "development",
    entry: path.resolve(__dirname, "src/main.ts"),
    devtool: isProduction ? "source-map" : "inline-source-map",
    output: {
      globalObject: '(typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : this)',
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
      publicPath: '/',
      libraryTarget: 'umd',
      library: {
        root: ["SANDBOX"],
      },
      umdNamedDefine: true
    },
    resolve: {
      extensions: [".js", '.ts', ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(css|scss)$/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      new MiniCssExtractPlugin({
        filename: 'style.[hash].css',
        path: path.resolve(__dirname, '/')
      })
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial",
          },
          babylonjs: {
            name: "chunk-babylonjs",
            priority: 20,
            test: /[\\/]node_modules[\\/]_?babylonjs(.*)/,
          },
        },
      },
    },
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      compress: true,
      progress: true,
      port: 8888,
      open: true,
      historyApiFallback: true,
      stats: 'minimal'
    }
  }
};