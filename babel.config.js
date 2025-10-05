module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          unstable_transformImportMeta: true, // 👈 fixes import.meta for Hermes
        },
      ],
    ],
    plugins: [
      ["@babel/plugin-transform-runtime", { regenerator: true }],
      "react-native-reanimated/plugin", // 👈 needed for navigation + animations
    ],
  };
};
