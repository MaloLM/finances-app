const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'electron-renderer',
  entry: './src/renderer/index.tsx', 
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
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
    historyApiFallback: true, 
    hot: true,
    port: 8080, 
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
