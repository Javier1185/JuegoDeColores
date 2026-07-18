/**
 * LevelIndicator.js
 * -----------------------------------------------------------------------
 * Muestra el nivel actual, ej. "Nivel 1". Componente simple, separado
 * para mantener consistencia visual si luego se decide convertirlo en
 * una insignia/badge con fondo en vez de solo texto.
 *
 * Props:
 *  - level: número de nivel actual
 * -----------------------------------------------------------------------
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { PALETTE, FONT_SIZES } from '../../styles/tema';

export default function LevelIndicator({ level }) {
  return <Text style={styles.text}>Nivel {level}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: FONT_SIZES.body,
    fontWeight: '700',
    color: PALETTE.textDark,
  },
});
