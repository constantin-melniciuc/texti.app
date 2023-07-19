module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      require.resolve("expo-router/babel"),
      "module:react-native-dotenv",
      "@babel/plugin-transform-flow-strip-types",
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      "@babel/plugin-proposal-export-namespace-from",
      [
        "babel-plugin-inline-import",
        {
          extensions: [".svg"],
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
