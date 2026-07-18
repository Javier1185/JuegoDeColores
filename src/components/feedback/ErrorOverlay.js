/**
 * ErrorOverlay.js
 * -----------------------------------------------------------------------
 * Overlay pequeño que aparece brevemente cuando el niño toca el animal
 * incorrecto. Usa un mensaje de ánimo (no punitivo), siguiendo el tono
 * de la imagen de referencia: "¡Buen intento! No pasa nada, intentémoslo
 * de nuevo. ¡Tú puedes! 🌈".
 *
 * Misma mecánica de entrada que SuccessOverlay pero con una sutil
 * sacudida horizontal para reforzar (sin sonar negativo) que la
 * respuesta no fue la correcta.
 *
 * Props:
 *  - visible: boolean, si se debe mostrar
 * -----------------------------------------------------------------------
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

import { PALETTE, FONT_SIZES, RADIUS, SHADOWS } from '../../styles/tema';

export default function ErrorOverlay({ visible }) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -4, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    } else {
      opacityAnim.setValue(0);
    }
  }, [visible, opacityAnim, shakeAnim]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          opacity: opacityAnim,
          transform: [{ translateX: shakeAnim }],
        },
      ]}
    >
      <Text style={styles.text}>¡Buen intento! 💪</Text>
      <Text style={styles.subtext}>Intentémoslo de nuevo. ¡Tú puedes! 🌈</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: PALETTE.error,
    padding: 20,
    borderRadius: RADIUS.medium,
    alignItems: 'center',
    ...SHADOWS.strong,
  },
  text: {
    color: PALETTE.textLight,
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
  },
  subtext: {
    color: PALETTE.textLight,
    fontSize: FONT_SIZES.small,
    marginTop: 4,
    textAlign: 'center',
  },
});
