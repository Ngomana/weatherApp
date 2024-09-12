// webpack.config.js
const Dotenv = require("dotenv-webpack");

module.exports = {
  // other webpack configuration if needed to build project
  plugins: [new Dotenv()],
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
      crypto: require.resolve("crypto-browserify"),
    },
  },
};
