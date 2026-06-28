/**
 * audioAssets.js
 * -----------------------------------------------------------------------
 * Centraliza TODOS los requires de audio que no son "colores"
 * (esos viven en constants/colors.js junto a cada color).
 *
 * Mantener todos los requires de audio en un solo lugar facilita:
 *  - reemplazar archivos de sonido sin tocar lógica
 *  - precargarlos todos de una vez desde useAudioPlayer / soundManager
 * -----------------------------------------------------------------------
 */

export const EFFECTS = {
  correct: require('../../assets/audio/effects/correct.mp3'),
  wrong: require('../../assets/audio/effects/wrong.mp3'),
  button: require('../../assets/audio/effects/button.mp3'),
  victory: require('../../assets/audio/effects/victory.mp3'),
};

export const MUSIC = {
  background: require('../../assets/audio/music/background.mp3'),
};

export default {
  EFFECTS,
  MUSIC,
};