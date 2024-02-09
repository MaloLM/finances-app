const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'production',
  target: 'electron-main',
  entry: {
    main: './src/main/main.js',
    preload: './src/main/preload.js'
  },  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src/main'), 
          path.resolve(__dirname, 'src/shared')
        ],
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.main.json'
          }
        }
      },
      {
        test: /\.tsx?$/,
        include: [
          path.resolve(__dirname, 'src/main'), 
          path.resolve(__dirname, 'src/shared')
        ],
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.main.json'
        }
      },
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: 'public/*.{png,jpg,jpeg,svg,ico,icns}',
          to: 'icons/[name][ext]', // Copies files into dist/icons maintaining their original filenames and extensions
          noErrorOnMissing: true, // Prevents errors if no files are matched
        },      
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'] // Add .ts and .tsx here
  },
};