const path = require('path');

module.exports = {
  mode: 'development',
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
      // You can add more loaders here for other types of files if needed
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'] // Add .ts and .tsx here
  },
};