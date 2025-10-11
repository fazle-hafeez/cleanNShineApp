module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",  // move it here
    ],
    plugins: [
      "react-native-reanimated/plugin",
    ],
  };
};
