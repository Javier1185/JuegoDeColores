module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // IMPORTANTE: el plugin de Reanimated debe ser siempre el ÚLTIMO
    // de la lista de plugins.
    plugins: ['react-native-reanimated/plugin'],
  };
};