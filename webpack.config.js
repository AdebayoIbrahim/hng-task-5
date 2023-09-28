const path = require("path");

module.exports = {
  popup: "./src/popup.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: "node_modules/",
        use: {
          loader: "babel-loader",
          option: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
};
