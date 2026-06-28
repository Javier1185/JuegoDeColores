/**
 * GameFinishedScreen.js
 * -----------------------------------------------------------------------
 * Pantalla final que aparece cuando el jugador completa TODOS los
 * niveles del juego. Muestra un mensaje de felicitación general y un
 * botón para volver al inicio.
 *
 * NOTA: versión funcional básica. En el paso de "animaciones" se le
 * puede agregar confeti y la mascota del granjero celebrando.
 * -----------------------------------------------------------------------
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { SCREENS } from '../navegacion/AppNavigator';
import { PALETTE, FONT_SIZES } from '../styles/tema';

export default function GameFinishedScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🏆</Text>
      <Text style={styles.title}>¡Felicidades!</Text>
      <Text style={styles.subtitle}>Completaste todos los niveles del juego</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate(SCREENS.HOME)}
      >
        <Text style={styles.buttonText}>Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.skyBlue,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '800',
    color: PALETTE.textLight,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: PALETTE.textLight,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: PALETTE.woodBrown,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  buttonText: {
    color: PALETTE.textLight,
    fontSize: FONT_SIZES.button,
    fontWeight: '700',
  },
});
