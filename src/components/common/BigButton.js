/**
 * BigButton.js
 * -----------------------------------------------------------------------
 * Botón grande tipo "madera/naturaleza", usado en Home y otras pantallas
 * de menú (Jugar, Cómo jugar, Créditos, Configuración, Siguiente Nivel).
 *
 * Incluye una animación de "presión" (escala hacia abajo al tocar,
 * vuelve a su tamaño al soltar) usando Animated de React Native,
 * para dar feedback táctil amigable a los niños.
 *
 * Props:
 *  - label: texto del botón
 *  - onPress: función al presionar
 *  - color: color de fondo (por defecto PALETTE.woodBrown)
 *  - icon: opcional, componente/emoji a mostrar antes del texto
 *  - style: estilos adicionales para el contenedor
 *  - textStyle: estilos adicionales para el texto
 *  - disabled: deshabilita el botón (se ve atenuado)
 * -----------------------------------------------------------------------
 */

import React, { useRef } from 'react';
import { Animated, Text, StyleSheet, Pressable } from 'react-native';

import { PALETTE, FONT_SIZES, RADIUS, SHADOWS } from '../../styles/tema';
import { reproducirSonidoBoton } from '../../utils/sonidoBoton';

export default function BigButton({
  label,
  onPress,
  color = PALETTE.woodBrown,
  icon = null,
  style,
  textStyle,
  disabled = false,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
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

  const handlePress = (event) => {
    reproducirSonidoBoton();
    onPress?.(event);
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.button,
          { backgroundColor: color, transform: [{ scale: scaleAnim }] },
          disabled && styles.disabled,
          style,
        ]}
      >
        {icon}
        <Text style={[styles.label, textStyle]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: RADIUS.medium,
    width: '100%',
    ...SHADOWS.soft,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: PALETTE.textLight,
    fontSize: FONT_SIZES.button,
    fontWeight: '700',
    marginLeft: 8,
  },
});