const path = require('path');

// Плагин Webpack для очистки директории dist
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Плагин для обработки html
const HTMLWebpackPlugin = require('html-webpack-plugin');

// Копирует файлы и директории в папку билда
const CopyPlugin = require('copy-webpack-plugin');

//
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',   // использовать лоадер babel с опцией
      options: {
        presets: ['@babel/preset-env']
      }
    }
  ];

  if (isDev) {
    loaders.push('eslint-loader');
  }
};

// ================================================================================

module.exports = {
  context: path.resolve(__dirname, 'src'),        // контекст - рабочая директория
  mode: 'development',                            // режим разработки
  entry: ['@babel/polyfill', './index.js'],       // точка входа
  output: {                                       // точка выхода
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core')
    }
  },
  devtool: isDev ? 'source-map' : false,  // нужно ли делать source-map, в зависиомсти от режима разработки
  devServer: {                                    // настройки dev-сервера
    port: 3000,
    open: true,
    hot: isDev,
  },
  plugins: [  // Массив используемых плагинов ====================================
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        }
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ],
  module: { // Для каких файлов какие лоадеры использовать ===================
    rules: [
      {
        test: /\.s[ac]ss$/i, // регулярка для определения типов файлов
        use: [ // какие обработки к этим файлам применить
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true
            }
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/, // регулярка для определения типов файлов
        exclude: /node_modules/, // исключить папку
        use: jsLoaders(),
      },
    ],
  },
};
