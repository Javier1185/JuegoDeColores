/**
 * StarCounter.js
 * -----------------------------------------------------------------------
 * Muestra el contador de estrellas acumuladas, ej. "⭐ 12".
 * Cuando el número cambia (al ganar una estrella), hace un pequeño
 * "pulso" de escala para llamar la atención sin ser invasivo.
 *
 * Props:
 *  - count: número actual de estrellas
 * -----------------------------------------------------------------------
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

import { PALETTE, FONT_SIZES } from '../../styles/tema';

export default function StarCounter({ count }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevCount = useRef(count);

  useEffect(() => {
    // Solo animamos si el número realmente subió (no en el primer render).
    if (count !== prevCount.current) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.3,
          useNativeDriver: true,
          speed: 20,
          bounciness: 12,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }),
      ]).start();
      prevCount.current = count;
    }
  }, [count, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Text style={styles.text}>⭐ {count}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: FONT_SIZES.body,
    fontWeight: '700',
    color: PALETTE.woodBrownDark,
  },
});
