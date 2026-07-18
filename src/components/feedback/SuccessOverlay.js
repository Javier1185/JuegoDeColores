/**
 * SuccessOverlay.js
 * -----------------------------------------------------------------------
 * Overlay pequeño que aparece brevemente SOBRE la pantalla de juego
 * cuando el niño toca el animal correcto (no confundir con
 * LevelCompleteScreen, que es la pantalla completa de fin de nivel).
 *
 * Aparece con un fade + slide desde abajo, y desaparece solo tras
 * "durationMs" (controlado por el padre, normalmente sincronizado con
 * el setTimeout que navega a LevelComplete).
 *
 * Props:
 *  - visible: boolean, si se debe mostrar
 * -----------------------------------------------------------------------
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

import { PALETTE, FONT_SIZES, RADIUS, SHADOWS } from '../../styles/tema';

export default function SuccessOverlay({ visible }) {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          speed: 14,
          bounciness: 8,
        }),
      ]).start();
    } else {
      opacityAnim.setValue(0);
      slideAnim.setValue(40);
    }
  }, [visible, opacityAnim, slideAnim]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.text}>¡Correcto! 🎉</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: PALETTE.success,
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
});
