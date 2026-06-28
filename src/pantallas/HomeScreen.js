/**
 * HomeScreen.js
 * -----------------------------------------------------------------------
 * Pantalla de inicio: título del juego y botones grandes para navegar
 * a Jugar, Cómo jugar, Créditos y Configuración.
 *
 * NOTA: versión funcional básica para probar la navegación. En el paso
 * de "pantallas" se reemplazará por el diseño final usando BigButton,
 * ScreenBackground y FarmerMascot.
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
    padding: 24,
  },
  logo: {
  width: '100%',
  height: 220,
  resizeMode: 'contain',
  marginBottom: 24,
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