/**
 * HomeScreen.js
 * -----------------------------------------------------------------------
 * Pantalla de inicio: logo del juego y botones grandes para navegar
 * a Jugar, Cómo jugar, Créditos y Configuración.
 *
 * Usa ScreenBackground para mostrar la imagen de fondo de granja/cielo
 * en vez de un color sólido.
 * -----------------------------------------------------------------------
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

import { SCREENS } from '../navegacion/AppNavigator';
import { PALETTE, FONT_SIZES } from '../styles/tema';
import ScreenBackground from '../components/common/ScreenBackground';

export default function HomeScreen({ navigation }) {
  return (
    <ScreenBackground source={require('../../assets/images/backgrounds/home-background.jpeg')}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/logo/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: PALETTE.success }]}
          onPress={() => navigation.navigate(SCREENS.GAME, { level: 1 })}
        >
          <Text style={styles.buttonText}>Jugar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: PALETTE.woodBrown }]}
          onPress={() => navigation.navigate(SCREENS.HOW_TO_PLAY)}
        >
          <Text style={styles.buttonText}>Cómo jugar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: PALETTE.woodBrown }]}
          onPress={() => navigation.navigate(SCREENS.CREDITS)}
        >
          <Text style={styles.buttonText}>Créditos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: PALETTE.woodBrownDark }]}
          onPress={() => navigation.navigate(SCREENS.SETTINGS)}
        >
          <Text style={styles.buttonText}>Configuración</Text>
        </TouchableOpacity>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // IMPORTANTE: ya NO ponemos backgroundColor aquí.
    // Si dejamos un color sólido en este View, tapa completamente
    // la imagen de ScreenBackground que está detrás.
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  logo: {
    width: '80%',
    height: 320,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 24,
    transform: [{ scale: 1.8 }],
  },
  button: {
    width: '80%',
    paddingVertical: 18,
    borderRadius: 20,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: PALETTE.textLight,
    fontSize: FONT_SIZES.button,
    fontWeight: '700',
  },
});