/**
 * LevelCompleteScreen.js
 * -----------------------------------------------------------------------
 * Pantalla de felicitación al completar un nivel: fondo oscurecido,
 * 3 estrellas animadas en secuencia, mensaje "¡Excelente!" y botón
 * para continuar al siguiente nivel (o ver el resultado final si era
 * el último nivel).
 * -----------------------------------------------------------------------
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { SCREENS } from '../navegacion/AppNavigator';
import { PALETTE, FONT_SIZES } from '../styles/tema';
import StarsAnimated from '../components/feedback/StarsAnimated';

export default function LevelCompleteScreen({ route, navigation }) {
  const { level, isLastLevel } = route.params ?? { level: 1, isLastLevel: false };

  const handleContinue = () => {
    if (isLastLevel) {
      navigation.navigate(SCREENS.GAME_FINISHED);
    } else {
      navigation.navigate(SCREENS.GAME, { level: level + 1 });
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <StarsAnimated earnedCount={3} size={48} />

        <Text style={styles.title}>¡Excelente!</Text>
        <Text style={styles.subtitle}>Nivel {level} completado</Text>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>
            {isLastLevel ? 'Ver resultado final' : 'Siguiente Nivel'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: PALETTE.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: PALETTE.cardWhite,
    borderRadius: 32,
    padding: 32,
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '800',
    color: PALETTE.success,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    color: PALETTE.textDark,
    marginBottom: 24,
  },
  button: {
    backgroundColor: PALETTE.success,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  buttonText: {
    color: PALETTE.textLight,
    fontSize: FONT_SIZES.button,
    fontWeight: '700',
  },
});