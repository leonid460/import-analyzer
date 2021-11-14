const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './src/main.ts',
  output: {
    filename: 'import-analyzer.js',
    path: path.resolve(__dirname, 'build')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader"
      }
    ]
  }
};
