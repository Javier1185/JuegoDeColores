/**
 * ColorPromptBanner.js
 * -----------------------------------------------------------------------
 * Banner blanco que muestra "Toca el animal [COLOR]" junto con un
 * botón de altavoz para repetir el audio del color pedido.
 *
 * Esto reemplaza el bloque "promptBanner" que antes vivía suelto
 * dentro de GameScreen.
 *
 * Props:
 *  - colorLabel: texto del color, ej. "AZUL"
 *  - colorHex: color con el que se resalta la palabra
 *  - onReplayAudio: función al presionar el botón de altavoz
 * -----------------------------------------------------------------------
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { PALETTE, FONT_SIZES, RADIUS, SHADOWS } from '../../styles/tema';
import RoundIconButton from '../common/RoundIconButton';

export default function ColorPromptBanner({ colorLabel, colorHex, onReplayAudio }) {
  return (
    <View style={styles.banner}>
      <RoundIconButton icon="🔊" onPress={onReplayAudio} size={44} />
      <Text style={styles.text}>
        Toca el animal <Text style={{ color: colorHex }}>{colorLabel}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.cardWhite,
    borderRadius: RADIUS.medium,
    padding: 16,
    marginBottom: 24,
    ...SHADOWS.soft,
  },
  text: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
    color: PALETTE.textDark,
    marginLeft: 12,
  },
});
