/**
 * SplashScreen.js
 * -----------------------------------------------------------------------
 * Pantalla de carga inicial: muestra el logo del juego y pasa
 * automáticamente a Home tras una breve animación de entrada.
 *
 * NOTA: esta es una versión funcional básica para probar la navegación.
 * En el paso de "pantallas" se le agregará la animación con Animated/
 * Reanimated descrita en los requerimientos (fade + scale del logo).
 * -----------------------------------------------------------------------
 */

import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';

import { SCREENS } from '../navegacion/AppNavigator';
import { PALETTE } from '../styles/tema';

const SPLASH_DURATION_MS = 2000;

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace(SCREENS.HOME);
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/logo/game-logo.png')}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.skyBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: 200,
  },
});
