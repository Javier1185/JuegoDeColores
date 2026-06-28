/**
 * HowToPlayScreen.js
 * -----------------------------------------------------------------------
 * Explica los 3 pasos del juego: escuchar el color, buscar el animal,
 * tocar el animal correcto. Inspirado en la sección "¿CÓMO SE JUEGA?"
 * de la imagen de referencia (círculos numerados verdes + texto).
 *
 * NOTA: versión funcional básica. En el paso de "pantallas" se le
 * agregarán ilustraciones reales para cada paso.
 * -----------------------------------------------------------------------
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import { PALETTE, FONT_SIZES } from '../styles/tema';

const STEPS = [
  { number: 1, text: 'Escucha el color que se te pide.' },
  { number: 2, text: 'Busca el animal que tiene ese color.' },
  { number: 3, text: 'Toca el animal correcto y gana estrellas.' },
];

export default function HowToPlayScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>¿Cómo se juega?</Text>

        {STEPS.map((step) => (
          <View key={step.number} style={styles.stepRow}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>{step.number}</Text>
            </View>
            <Text style={styles.stepText}>{step.text}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.cream,
    paddingTop: 60,
  },
  scrollContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: '800',
    color: PALETTE.success,
    marginBottom: 32,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.cardWhite,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PALETTE.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumber: {
    color: PALETTE.textLight,
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    fontSize: FONT_SIZES.body,
    color: PALETTE.textDark,
  },
  backButton: {
    backgroundColor: PALETTE.woodBrown,
    margin: 24,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: PALETTE.textLight,
    fontSize: FONT_SIZES.button,
    fontWeight: '700',
  },
});
