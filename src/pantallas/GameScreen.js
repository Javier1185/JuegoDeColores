/**
 * GameScreen.js
 * -----------------------------------------------------------------------
 * Pantalla principal del juego: muestra los animales, el color pedido,
 * y valida si el niño toca el animal correcto.
 *
 * NOTA: esta es una versión funcional básica para probar la navegación
 * y el flujo de niveles. La lógica completa (audio, animaciones de
 * estrellas, overlays de éxito/error con react-native-reanimated) se
 * construirá en el paso de "lógica del juego" y "animaciones".
 * -----------------------------------------------------------------------
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import { SCREENS } from '../navegacion/AppNavigator';
import { PALETTE, FONT_SIZES } from '../styles/tema';
import ANIMALS_LIST from '../constantes/animales';
import { getColorById } from '../constantes/colores';
import { EFFECTS } from '../constantes/configuracionAudio';

// Nivel "base" de prueba: usamos los 4 animales con sus colores fijos.
// En el paso de "lógica del juego" esto vendrá de data/levelsData.js
// y cambiará el color objetivo en cada ronda dentro del mismo nivel.
const TOTAL_LEVELS = 3;
 
// Calculamos el tamaño de cada tarjeta de animal en base al ancho real
// de la pantalla, no en porcentaje suelto. Esto evita que en pantallas
// anchas (tablets, web, emuladores grandes) los cuadros se vean enormes.
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_HORIZONTAL_PADDING = 16 * 2; // paddingHorizontal del container
const GRID_GAP = 16;
const COLUMNS = 2;
const MAX_CARD_SIZE = 170; // tope máximo en px, clave para pantallas grandes
 
const availableWidth = SCREEN_WIDTH - GRID_HORIZONTAL_PADDING - GRID_GAP;
const calculatedCardSize = availableWidth / COLUMNS;
const CARD_SIZE = Math.min(calculatedCardSize, MAX_CARD_SIZE);
 
export default function GameScreen({ route, navigation }) {
  const level = route.params?.level ?? 1;
 
  const [targetColorId] = useState(
    ANIMALS_LIST[Math.floor(Math.random() * ANIMALS_LIST.length)].colorId
  );
  const [stars, setStars] = useState(12);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
 
  const targetColor = getColorById(targetColorId);
 
  // Referencia al sonido actualmente cargado, para poder descargarlo
  // correctamente y evitar fugas de memoria al desmontar la pantalla.
  const soundRef = useRef(null);
 
  const playSound = useCallback(async (soundAsset) => {
    try {
      // Si ya hay un sonido cargado, lo descargamos antes de cargar otro.
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(soundAsset);
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.warn('Error reproduciendo audio:', error);
    }
  }, []);
 
  // Reproduce el audio del color objetivo automáticamente al entrar
  // a la pantalla (o al cambiar de nivel).
  useEffect(() => {
    playSound(targetColor.audio);
 
    // Limpieza: descarga el sonido cuando se sale de la pantalla.
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  const handleReplayAudio = () => {
    playSound(targetColor.audio);
  };
 
  const handleAnimalPress = (animal) => {
    if (animal.colorId === targetColorId) {
      setFeedback('correct');
      playSound(EFFECTS.correct);
      setStars((prev) => prev + 1);
      setTimeout(() => {
        navigation.navigate(SCREENS.LEVEL_COMPLETE, {
          level,
          isLastLevel: level >= TOTAL_LEVELS,
        });
      }, 1000);
    } else {
      setFeedback('wrong');
      playSound(EFFECTS.wrong);
      setTimeout(() => setFeedback(null), 1000);
    }
  };
 
  return (
    <View style={styles.container}>
      {/* Encabezado: home, nivel, estrellas (fijo, no scrollea) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate(SCREENS.HOME)}>
          <Text style={styles.headerIcon}>🏠</Text>
        </TouchableOpacity>
        <Text style={styles.levelText}>Nivel {level}</Text>
        <Text style={styles.starsText}>⭐ {stars}</Text>
      </View>
 
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Indicador del color pedido + botón de repetir audio */}
        <View style={styles.promptBanner}>
          <TouchableOpacity onPress={handleReplayAudio} style={styles.speakerButton}>
            <Text style={styles.speakerIcon}>🔊</Text>
          </TouchableOpacity>
          <Text style={styles.promptText}>
            Toca el animal{' '}
            <Text style={{ color: targetColor.hex }}>{targetColor.label}</Text>
          </Text>
        </View>
 
        {/* Grid de animales con tamaño controlado */}
        <View style={styles.animalsGrid}>
          {ANIMALS_LIST.map((animal) => (
            <TouchableOpacity
              key={animal.id}
              style={styles.animalCard}
              onPress={() => handleAnimalPress(animal)}
              activeOpacity={0.7}
            >
              <Image
                source={animal.image}
                style={styles.animalImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
 
      {/* Feedback simple de prueba (se reemplazará por overlays animados) */}
      {feedback === 'correct' && (
        <View style={[styles.feedbackBanner, { backgroundColor: PALETTE.success }]}>
          <Text style={styles.feedbackText}>¡Correcto! 🎉</Text>
        </View>
      )}
      {feedback === 'wrong' && (
        <View style={[styles.feedbackBanner, { backgroundColor: PALETTE.error }]}>
          <Text style={styles.feedbackText}>¡Intenta de nuevo! 💪</Text>
        </View>
      )}
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.skyBlue,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 28,
  },
  levelText: {
    fontSize: FONT_SIZES.body,
    fontWeight: '700',
    color: PALETTE.textDark,
  },
  starsText: {
    fontSize: FONT_SIZES.body,
    fontWeight: '700',
    color: PALETTE.woodBrownDark,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  promptBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.cardWhite,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  speakerButton: {
    marginRight: 12,
  },
  speakerIcon: {
    fontSize: 24,
  },
  promptText: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
    color: PALETTE.textDark,
  },
  animalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: GRID_GAP,
  },
  animalCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: PALETTE.cardWhite,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  animalImage: {
    width: '75%',
    height: '75%',
  },
  feedbackBanner: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  feedbackText: {
    color: PALETTE.textLight,
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
  },
});