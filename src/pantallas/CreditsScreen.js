/**
 * CreditsScreen.js
 * -------------------------------------------------------------
 * Pantalla de Créditos
 * Diseño infantil inspirado en una granja.
 * -------------------------------------------------------------
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { PALETTE, FONT_SIZES } from '../styles/tema';

export default function CreditsScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#8EDBFF', '#CFF6FF', '#FFF6D6']}
      style={styles.container}
    >
      {/* Nubes */}
      <Text style={styles.cloud1}>☁️</Text>
      <Text style={styles.cloud2}>☁️</Text>

      {/* Flores */}
      <Text style={styles.flowerLeft}></Text>
      <Text style={styles.flowerRight}></Text>

      <View style={styles.boardShadow} />

      <View style={styles.board}>

        <Text style={styles.title}>🌟 Créditos 🌟</Text>

        <Text style={styles.game}>🐮 La Granja de los Colores 🐷</Text>

        <Text style={styles.description}>
          Un juego educativo diseñado para que los niños aprendan
          los colores mientras juegan y se divierten.
        </Text>

        <View style={styles.separator} />

        <Text style={styles.section}> Desarrolladores</Text>

        <Text style={styles.name}> Javier Forchiney</Text>
        <Text style={styles.name}> Pablo Pimentel</Text>
        <Text style={styles.name}> Mayker Saucedo</Text>

        <View style={styles.separator} />

        <Text style={styles.section}> Voces</Text>

        <Text style={styles.name}>🎙 Denis Gómez</Text>

        <View style={styles.separator} />

        <Text style={styles.version}>
          ⭐ Versión 1.0.0 ⭐
        </Text>

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#D69C4A', '#B36A27', '#8A4E1D']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}> Volver</Text>
        </LinearGradient>
      </TouchableOpacity>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  cloud1: {
    position: 'absolute',
    top: 40,
    left: 20,
    fontSize: 42,
  },

  cloud2: {
    position: 'absolute',
    top: 80,
    right: 25,
    fontSize: 36,
  },

  flowerLeft: {
    position: 'absolute',
    bottom: 45,
    left: 18,
    fontSize: 40,
  },

  flowerRight: {
    position: 'absolute',
    bottom: 45,
    right: 18,
    fontSize: 40,
  },

  boardShadow: {
    position: 'absolute',
    width: '88%',
    height: 470,
    borderRadius: 30,
    backgroundColor: '#8B5A2B',
    top: '16%',
    opacity: 0.35,
    transform: [{ translateY: 8 }],
  },

  board: {
    width: '88%',
    backgroundColor: '#FFF5D6',
    borderRadius: 30,
    padding: 25,
    borderWidth: 5,
    borderColor: '#C88B3A',
    alignItems: 'center',
    elevation: 8,
  },

  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#A15C1D',
    marginBottom: 18,
  },

  game: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#3B7D3A',
    textAlign: 'center',
    marginBottom: 10,
  },

  description: {
    fontSize: 17,
    color: '#5D4632',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 18,
  },

  separator: {
    width: '80%',
    height: 3,
    backgroundColor: '#E4C07B',
    borderRadius: 10,
    marginVertical: 16,
  },

  section: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#D97A00',
    marginBottom: 10,
  },

  name: {
    fontSize: 20,
    color: '#5B4636',
    marginBottom: 8,
    fontWeight: '600',
  },

  version: {
    marginTop: 10,
    fontSize: 18,
    color: '#7A5B2E',
    fontWeight: '700',
  },

  button: {
    width: '72%',
    marginTop: 30,
    borderRadius: 22,
  },

  buttonGradient: {
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD37A',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: '#5A2D00',
    textShadowOffset: {
      width: 1,
      height: 2,
    },
    textShadowRadius: 3,
  },

});