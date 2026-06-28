/**
 * SettingsScreen.js
 * -----------------------------------------------------------------------
 * Pantalla de configuración (opcional según los requerimientos).
 * Pensada para futuros controles como: activar/desactivar música,
 * activar/desactivar efectos de sonido, reiniciar progreso, etc.
 *
 * NOTA: versión funcional básica para probar la navegación.
 * -----------------------------------------------------------------------
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { PALETTE, FONT_SIZES } from '../styles/tema';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      <Text style={styles.text}>(Próximamente: música, sonido, progreso)</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.cream,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '800',
    color: PALETTE.woodBrownDark,
    marginBottom: 16,
  },
  text: {
    fontSize: FONT_SIZES.body,
    color: PALETTE.textDark,
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: PALETTE.woodBrown,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: PALETTE.textLight,
    fontSize: FONT_SIZES.button,
    fontWeight: '700',
  },
});
