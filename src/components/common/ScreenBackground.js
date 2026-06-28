/**
 * ScreenBackground.js
 * -----------------------------------------------------------------------
 * Envuelve el contenido de una pantalla con una imagen de fondo
 * (cielo, granja, etc.), escalada para cubrir toda la pantalla.
 *
 * Uso:
 *   <ScreenBackground source={require('.../farm-background.png')}>
 *     ...contenido de la pantalla...
 *   </ScreenBackground>
 *
 * Si no se pasa "source", se usa un color sólido de respaldo
 * (PALETTE.skyBlue) para que la pantalla nunca se vea rota mientras
 * se reemplazan los assets finales.
 * -----------------------------------------------------------------------
 */

import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';

import { PALETTE } from '../../styles/tema';

export default function ScreenBackground({ source, children, style }) {
  if (!source) {
    return (
      <View style={[styles.fallback, style]}>
        {children}
      </View>
    );
  }

  return (
    <ImageBackground
      source={source}
      style={[styles.background, style]}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  fallback: {
    flex: 1,
    backgroundColor: PALETTE.skyBlue,
  },
});