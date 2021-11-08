const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    filename: 'index.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: "js-counter",
    libraryTarget: "umd" 
  },
};