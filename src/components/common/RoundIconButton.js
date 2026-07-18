/**
 * RoundIconButton.js
 * -----------------------------------------------------------------------
 * Botón circular pequeño, usado para iconos como: 🏠 (volver al inicio),
 * 🔊 (repetir audio), ⚙️ (configuración), 🔁 (reintentar).
 *
 * Acepta tanto un emoji/texto como "icon" (más simple, ya usado en las
 * pantallas de prueba) o una imagen vía "iconSource" si luego se
 * reemplaza por íconos ilustrados de assets/images/icons/.
 *
 * Props:
 *  - icon: string/emoji a mostrar (ej. "🏠")
 *  - iconSource: imagen opcional (require(...)) en vez de emoji
 *  - onPress: función al presionar
 *  - backgroundColor: color de fondo del círculo
 *  - size: diámetro del botón (default 56)
 * -----------------------------------------------------------------------
 */

import React, { useRef } from 'react';
import { Animated, Text, Image, StyleSheet, Pressable } from 'react-native';

import { PALETTE, SHADOWS } from '../../styles/tema';

export default function RoundIconButton({
  icon,
  iconSource,
  onPress,
  backgroundColor = PALETTE.cardWhite,
  size = 56,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
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
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {iconSource ? (
          <Image
            source={iconSource}
            style={{ width: size * 0.6, height: size * 0.6 }}
            resizeMode="contain"
          />
        ) : (
          <Text style={{ fontSize: size * 0.5 }}>{icon}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
});
