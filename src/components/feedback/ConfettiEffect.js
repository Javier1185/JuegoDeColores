/**
 * ConfettiEffect.js
 * -----------------------------------------------------------------------
 * Efecto de confeti simple para la pantalla de "Nivel completado" y
 * "Juego finalizado", igual que se ve en la imagen de referencia.
 *
 * Implementado con Animated puro (sin librerías externas de confeti)
 * para mantenernos dentro de las dependencias ya instaladas: genera
 * N piezas de confeti que caen desde arriba con rotación y velocidad
 * ligeramente distinta entre sí para que se vea natural.
 *
 * Props:
 *  - count: cantidad de piezas de confeti (default 18)
 *  - colors: array de colores hex a usar (default usa GAME_COLORS)
 * -----------------------------------------------------------------------
 */

import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';

import { GAME_COLORS } from '../../styles/tema';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_COLORS = Object.values(GAME_COLORS);

function ConfettiPiece({ color, startX, delay, duration, size }) {
  const fallAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fallAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateY = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, SCREEN_HEIGHT * 0.6],
  });

  const opacity = fallAnim.interpolate({
    inputRange: [0, 0.85, 1],
    outputRange: [1, 1, 0],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: startX,
          width: size,
          height: size,
          backgroundColor: color,
          opacity,
          transform: [{ translateY }, { rotate }],
        },
      ]}
    />
  );
}

export default function ConfettiEffect({ count = 18, colors = DEFAULT_COLORS }) {
  // Generamos la configuración de cada pieza UNA sola vez (no en cada
  // render) usando useRef, para que no se reinicien las animaciones.
  const piecesConfig = useRef(
    Array.from({ length: count }, (_, index) => ({
      key: index,
      color: colors[index % colors.length],
      startX: Math.random() * SCREEN_WIDTH,
      delay: Math.random() * 400,
      duration: 1800 + Math.random() * 1000,
      size: 8 + Math.random() * 6,
    }))
  ).current;

  return (
    <View style={styles.container} pointerEvents="none">
      {piecesConfig.map((piece) => (
        <ConfettiPiece {...piece} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  piece: {
    position: 'absolute',
    top: 0,
    borderRadius: 2,
  },
});
