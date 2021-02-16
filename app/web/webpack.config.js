const path = require('path');
const webpack = require('webpack');
const os = require('os');
const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './index.js',
  ],
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    alias: {
      // dir
      libs: path.resolve(__dirname, '../libs'),
      utils: path.resolve(__dirname, 'utils'),
      resources: path.resolve(__dirname, 'resources'),
      public: path.resolve(__dirname, 'views/public'),
    },
    extensions: ['.js', '.jsx'],
  },
  module: {
    noParse:[/jquery/],
    rules: [
      {
        test: /\.m?js|\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: ['happypack/loader?id=babel']
      },
      {
        test: /\.css$/,
        use: ['happypack/loader?id=css'],
      },
      {
        test: /\.less$/,
        use: ['happypack/loader?id=less'],
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
        },
      },
      {
        test: /\.(ico|woff|eot|ttf|woff2|icns)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 500, // 小于500B的文件直接写入bunndle
              name: '[name]_[hash:8].[ext]',
              outputPath: 'resources/assets',
            },
          },
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|jpeg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'resources/images',
            },
          }
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new HappyPack({
      id: 'babel',
      threadPool: happyThreadPool,
      loaders: ["babel-loader?cacheDirectory"],
    }),
    new HappyPack({
      id: 'css',
      threadPool: happyThreadPool,
      loaders: ['style-loader', 'css-loader'],
    }),
    new HappyPack({
      id: 'less',
      threadPool: happyThreadPool,
      loaders: ['style-loader', 'css-loader', 'less-loader'],
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: 'body',
      minify: true
    }),
  ],

  devServer: {
    host: 'localhost',
    port: 3000,
    compress: true,
    contentBase: '.',
    historyApiFallback: true,
    hot: true,
    inline: true,
    liveReload: false
  },

  target: 'electron-renderer',
};
