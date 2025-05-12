// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    // …other plugins…
    'react-native-reanimated/plugin', // ← must be last
  ],
};