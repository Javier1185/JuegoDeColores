/**
 * StarsAnimated.js
 * -----------------------------------------------------------------------
 * Las 3 estrellas grandes que aparecen en la pantalla de "Nivel
 * completado", animadas en SECUENCIA (una tras otra, no todas a la
 * vez), igual que en la imagen de referencia.
 *
 * Cada estrella aparece con un efecto de "pop": empieza en escala 0,
 * y rebota hasta su tamaño final.
 *
 * Props:
 *  - earnedCount: cuántas estrellas se ganaron (1, 2 o 3). Las estrellas
 *    no ganadas se muestran en gris y sin animación de pop.
 *  - size: tamaño de cada estrella en px
 * -----------------------------------------------------------------------
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet } from 'react-native';

import { PALETTE } from '../../styles/tema';

const TOTAL_STARS = 3;
const DELAY_BETWEEN_STARS_MS = 250;

export default function StarsAnimated({ earnedCount = 3, size = 56 }) {
  // Un Animated.Value de escala por cada estrella ganada.
  const scaleAnims = useRef(
    Array.from({ length: TOTAL_STARS }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = scaleAnims.map((anim, index) => {
      const isEarned = index < earnedCount;
      // Las estrellas no ganadas se quedan en escala 1 (visibles, en
      // gris) sin efecto de pop, ya que no hay nada que celebrar.
      const targetValue = 1;

      if (!isEarned) {
        anim.setValue(1);
        return null;
      }

      return Animated.sequence([
        Animated.delay(index * DELAY_BETWEEN_STARS_MS),
        Animated.spring(anim, {
          toValue: targetValue,
          useNativeDriver: true,
          speed: 14,
          bounciness: 14,
        }),
      ]);
    });

    Animated.parallel(animations.filter(Boolean)).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [earnedCount]);

  return (
    <View style={styles.row}>
      {scaleAnims.map((anim, index) => {
        const isEarned = index < earnedCount;
        return (
          <Animated.View
            key={index}
            style={{ transform: [{ scale: anim }] }}
          >
            <Text
              style={[
                styles.star,
                { fontSize: size, color: isEarned ? PALETTE.starGold : PALETTE.starEmpty },
              ]}
            >
              ⭐
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  star: {
    marginHorizontal: 6,
  },
});