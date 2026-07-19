/**
 * SplashScreen.js
 * -----------------------------------------------------------------------
 * Pantalla de carga inicial con animación de entrada:
 *  - El logo aparece con fade (opacidad 0 → 1) + scale (0.7 → 1)
 *  - Un pequeño delay de 100ms antes de arrancar la animación asegura
 *    que el componente ya esté montado y React Native detecte el cambio.
 *  - Pasa automáticamente a Home después de SPLASH_DURATION_MS.
 * -----------------------------------------------------------------------
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import { SCREENS } from '../navegacion/AppNavigator';
import { PALETTE } from '../styles/tema';
import ScreenBackground from '../components/common/ScreenBackground';

const SPLASH_DURATION_MS = 2800;

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Pequeño delay para asegurar que el componente está montado
    // antes de arrancar la animación — sin esto, el fade no se ve.
    const startAnim = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 10,
          bounciness: 8,
        }),
      ]).start();
    }, 100);

    // Navegar a Home después de la duración total
    const navTimer = setTimeout(() => {
      navigation.replace(SCREENS.HOME);
    }, SPLASH_DURATION_MS);

    return () => {
      clearTimeout(startAnim);
      clearTimeout(navTimer);
    };
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <ScreenBackground
      source={require('../../assets/images/backgrounds/home-background.jpeg')}
    >
      <View style={styles.container}>
        <Animated.Image
          source={require('../../assets/images/logo/logo.png')}
          style={[
            styles.logo,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
          resizeMode="contain"
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '85%',
    height: 260,
  },
});