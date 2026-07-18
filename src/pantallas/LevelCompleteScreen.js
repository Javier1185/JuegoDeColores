/**
 * LevelCompleteScreen.js
 * -----------------------------------------------------------------------
 * Pantalla de felicitación al completar un nivel.
 * Las estrellas acumuladas viajan via route.params.stars y se pasan
 * al siguiente nivel para mantener el contador correcto.
 * -----------------------------------------------------------------------
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRef, useEffect } from 'react';

import { SCREENS } from '../navegacion/AppNavigator';
import { PALETTE, FONT_SIZES } from '../styles/tema';
import StarsAnimated from '../components/feedback/StarsAnimated';

export default function LevelCompleteScreen({ route, navigation }) {
  const { level, stars = 0, isLastLevel = false } =
    route.params ?? {};

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Animación de entrada de la tarjeta
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const handleContinue = () => {
    if (isLastLevel) {
      navigation.navigate(SCREENS.GAME_FINISHED, { stars });
    } else {
      // Pasamos las estrellas acumuladas al siguiente nivel
      navigation.navigate(SCREENS.GAME, {
        level: level + 1,
        stars,
      });
    }
  };

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <StarsAnimated earnedCount={3} size={48} />

        <Text style={styles.title}>¡Excelente!</Text>
        <Text style={styles.subtitle}>Nivel {level} completado</Text>
        <Text style={styles.starsCount}>⭐ {stars} estrellas ganadas</Text>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>
            {isLastLevel ? 'Ver resultado final' : 'Siguiente Nivel'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: PALETTE.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: PALETTE.cardWhite,
    borderRadius: 32,
    padding: 32,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '800',
    color: PALETTE.success,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: PALETTE.textDark,
    marginBottom: 4,
  },
  starsCount: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
    color: '#F1C40F',
    marginBottom: 24,
  },
  button: {
    backgroundColor: PALETTE.success,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
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