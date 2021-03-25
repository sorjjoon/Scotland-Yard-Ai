const path = require("path");

module.exports = {
  entry: "./src/client/client.ts",
  mode:"none",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.client.json",
            },
          },
        ],
        exclude: [/node_modules/,path.resolve(__dirname, "server", "index.ts")]
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "client.bundle.js",
    path: path.resolve(__dirname, "public"),
    libraryTarget: 'var',
    library: 'lib'
  },
};
