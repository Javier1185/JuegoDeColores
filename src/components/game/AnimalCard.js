/**
 * AnimalCard.js
 * -----------------------------------------------------------------------
 * Tarjeta tocable que muestra un animal en la pantalla de juego.
 * Reemplaza el bloque que antes vivía suelto dentro de GameScreen.
 *
 * Maneja 3 estados visuales vía la prop "feedbackState":
 *  - null/undefined: estado normal
 *  - 'correct': solo se aplica si esta tarjeta fue la tocada y era
 *    correcta -> rebote de celebración (scale up/down)
 *  - 'wrong': solo se aplica si esta tarjeta fue la tocada y era
 *    incorrecta -> sacudida horizontal (shake)
 *
 * Props:
 *  - animal: objeto de constants/animals.js { id, name, colorId, image }
 *  - onPress: función al tocar la tarjeta
 *  - size: tamaño en px del lado de la tarjeta (cuadrada)
 *  - feedbackState: 'correct' | 'wrong' | null
 * -----------------------------------------------------------------------
 */

import React, { useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, Image, StyleSheet } from 'react-native';

import { PALETTE, RADIUS, SHADOWS } from '../../styles/tema';

export default function AnimalCard({ animal, onPress, size = 130, feedbackState }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Animación de "rebote de celebración" cuando esta tarjeta fue la
  // respuesta correcta.
  useEffect(() => {
    if (feedbackState === 'correct') {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.15,
          useNativeDriver: true,
          speed: 20,
          bounciness: 10,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 10,
        }),
      ]).start();
    }
  }, [feedbackState, scaleAnim]);

  // Animación de "sacudida" cuando esta tarjeta fue tocada por error.
  useEffect(() => {
    if (feedbackState === 'wrong') {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }, [feedbackState, shakeAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(animal)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.85}
    >
      <Animated.View
        style={[
          styles.card,
          {
            width: size,
            height: size,
            transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
          },
        ]}
      >
        <Image source={animal.image} style={styles.image} resizeMode="contain" />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: PALETTE.cardWhite,
    borderRadius: RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  image: {
    width: '90%',
    height: '90%',
  },
});