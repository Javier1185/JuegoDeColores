/**
 * FarmerMascot.js
 * -----------------------------------------------------------------------
 * Muestra al granjero (personaje guía del juego, visto en la imagen de
 * referencia) con una sutil animación de "flotación" (sube y baja
 * lentamente en bucle) para que se sienta vivo sin distraer.
 *
 * Reutilizable en: Home, Splash, pantallas de victoria/error.
 *
 * Props:
 *  - size: ancho del personaje (el alto se ajusta proporcionalmente)
 *  - animated: si es false, se muestra estático (sin loop de flotación)
 *  - style: estilos adicionales para el contenedor
 * -----------------------------------------------------------------------
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

const FARMER_IMAGE = require('../../../assets/images/characters/farmer-mascot.png');
const FARMER_ASPECT_RATIO = 1000 / 800; // alto / ancho, según el tamaño definido para el asset

export default function FarmerMascot({ size = 180, animated = true, style }) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    floatLoop.start();

    return () => floatLoop.stop();
  }, [animated, floatAnim]);

  return (
    <Animated.Image
      source={FARMER_IMAGE}
      resizeMode="contain"
      style={[
        {
          width: size,
          height: size * FARMER_ASPECT_RATIO,
          transform: [{ translateY: floatAnim }],
        },
        styles.image,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
});
