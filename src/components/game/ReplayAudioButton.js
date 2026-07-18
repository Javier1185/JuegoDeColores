/**
 * ReplayAudioButton.js
 * -----------------------------------------------------------------------
 * Botón independiente de "repetir audio", separado de ColorPromptBanner
 * para poder reutilizarlo en otros contextos (ej. una pantalla de
 * práctica de colores, o dentro de HowToPlayScreen).
 *
 * Internamente usa RoundIconButton, manteniendo un solo lugar donde
 * vive la animación de presión de botones circulares.
 *
 * Props:
 *  - onPress: función al presionar (debe reproducir el audio)
 *  - size: tamaño del botón circular
 * -----------------------------------------------------------------------
 */

import React from 'react';

import RoundIconButton from '../common/RoundIconButton';
import { PALETTE } from '../../styles/tema';

export default function ReplayAudioButton({ onPress, size = 50 }) {
  return (
    <RoundIconButton
      icon="🔊"
      onPress={onPress}
      size={size}
      backgroundColor={PALETTE.cardWhite}
    />
  );
}
