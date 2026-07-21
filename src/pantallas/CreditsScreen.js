/**
 * CreditsScreen.js
 * -----------------------------------------------------------------------
 * Pantalla de créditos del juego.
 *
 * NOTA: versión funcional básica para probar la navegación. Puedes
 * personalizar el contenido (nombres, agradecimientos, versión) según
 * -----------------------------------------------------------------------
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { PALETTE, FONT_SIZES } from '../styles/tema';

export default function CreditsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créditos</Text>
      <Text style={styles.text}>La Granja de los Colores</Text>
      <Text style={styles.text}>Un juego educativo para aprender los colores</Text>
      <Text style={styles.text}>Desarrollado por:</Text>
       <Text style={styles.text}>Javier Forchiney</Text>
        <Text style={styles.text}>Pablo Pimentel</Text>
        <Text style={styles.text}>Mayker Saucedo</Text>
      <Text style={styles.text}>Versión 1.0.0</Text>

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
    color: PALETTE.woodBrown,
    marginBottom: 24,
  },
  text: {
    fontSize: FONT_SIZES.body,
    color: PALETTE.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: PALETTE.woodBrown,
    marginTop: 32,
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
