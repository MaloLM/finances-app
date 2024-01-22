const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'electron-renderer', // or 'electron-main' based on your context
  entry: './src/renderer/index.tsx', // Update this path based on your entry file location
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.renderer.json'
        },        
        include: [path.resolve(__dirname, 'src/renderer'), path.resolve(__dirname, 'src/shared')],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // contentBase is replaced by static.directory
    },
    historyApiFallback: true, // For Single Page Applications
    hot: true, // Enable hot module replacement
    port: 8080, // Default is 8080
  },
  output: {
    filename: 'renderer.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Update this path based on your HTML template location
    }),
  ],
};
