/**
 * GameScreen.js
 * -----------------------------------------------------------------------
 * Pantalla principal del juego.
 *
 * Cambios respecto a la versión anterior:
 *  - Usa data/niveles.js para seleccionar los 4 animales del nivel con
 *    distribución real de dificultad (2 fácil + 1 medio + 1 difícil).
 *  - Las estrellas se acumulan correctamente entre niveles: llegan via
 *    route.params.stars y se pasan al siguiente nivel al avanzar.
 *  - Animación de "rebote" en el animal correcto al tocarlo.
 *  - Animación de "sacudida" en el animal incorrecto al tocarlo.
 *  - Animación de "presión" (scale) en el botón de altavoz y el de casa.
 * -----------------------------------------------------------------------
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';

import { SCREENS } from '../navegacion/AppNavigator';
import { PALETTE, FONT_SIZES } from '../styles/tema';
import { getAnimalById } from '../constantes/animales';
import { getColorById } from '../constantes/colores';
import { EFFECTS } from '../constantes/configuracionAudio';
import { generarNivel, TOTAL_NIVELES } from '../data/niveles';
import ScreenBackground from '../components/common/ScreenBackground';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 16;
const MAX_CARD_SIZE = 130;
const CARD_SIZE = Math.min(
  (SCREEN_WIDTH - 32 - GRID_GAP) / 2,
  MAX_CARD_SIZE
);

// -----------------------------------------------------------------
// Componente interno: tarjeta de animal con animaciones
// -----------------------------------------------------------------
function AnimalCard({ animal, onPress, feedbackState }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Rebote cuando acierta
  useEffect(() => {
    if (feedbackState === 'correct') {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.18,
          useNativeDriver: true,
          speed: 20,
          bounciness: 12,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }),
      ]).start();
    }
  }, [feedbackState, scaleAnim]);

  // Sacudida cuando falla
  useEffect(() => {
    if (feedbackState === 'wrong') {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -7, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 7, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }, [feedbackState, shakeAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.93,
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
    <TouchableOpacity
      onPress={() => onPress(animal)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.85}
    >
      <Animated.View
        style={[
          styles.cardShadowWrapper,
          {
            transform: [
              { scale: scaleAnim },
              { translateX: shakeAnim },
            ],
          },
        ]}
      >
        <ImageBackground
          source={require('../../assets/images/game/caja_fondo.png')}
          style={styles.animalCard}
          imageStyle={styles.animalCardImage}
        >
          <Image
            source={animal.image}
            style={styles.animalImage}
            resizeMode="contain"
          />
        </ImageBackground>
      </Animated.View>
    </TouchableOpacity>
  );
}

// -----------------------------------------------------------------
// Componente interno: botón con animación de presión
// -----------------------------------------------------------------
function AnimatedButton({ onPress, children, style }) {
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
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.85}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

// -----------------------------------------------------------------
// Pantalla principal
// -----------------------------------------------------------------
export default function GameScreen({ route, navigation }) {
  const level = route.params?.level ?? 1;
  // Las estrellas viajan entre niveles via params para acumularse
  const initialStars = route.params?.stars ?? 0;

  // Generamos los animales del nivel UNA sola vez (no en cada render)
  const nivelData = useRef(generarNivel(level)).current;
  const animalesDelNivel = nivelData.animalesIds
    .map((id) => getAnimalById(id))
    .filter(Boolean); // filtramos por si algún id no existe en animales.js

  const animalObjetivo = getAnimalById(nivelData.targetAnimalId);
  const colorObjetivo = getColorById(animalObjetivo?.colorId);

  const [stars, setStars] = useState(initialStars);
  const [feedback, setFeedback] = useState(null);      // 'correct' | 'wrong' | null
  const [pressedId, setPressedId] = useState(null);    // id del animal tocado

  const soundRef = useRef(null);

  const playSound = useCallback(async (soundAsset) => {
    try {
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

  // Reproduce el audio del color al entrar al nivel
  useEffect(() => {
    if (colorObjetivo?.audio) {
      playSound(colorObjetivo.audio);
    }
    return () => {
      soundRef.current?.unloadAsync();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReplayAudio = () => {
    if (colorObjetivo?.audio) playSound(colorObjetivo.audio);
  };

  const handleAnimalPress = (animal) => {
    if (feedback) return; // evitar doble toque mientras hay feedback activo

    setPressedId(animal.id);

    if (animal.id === animalObjetivo?.id) {
      const newStars = stars + 1;
      setStars(newStars);
      setFeedback('correct');
      playSound(EFFECTS.correct);

      setTimeout(() => {
        navigation.navigate(SCREENS.LEVEL_COMPLETE, {
          level,
          stars: newStars,           // pasamos las estrellas acumuladas
          isLastLevel: level >= TOTAL_NIVELES,
        });
      }, 1000);
    } else {
      setFeedback('wrong');
      playSound(EFFECTS.wrong);
      setTimeout(() => {
        setFeedback(null);
        setPressedId(null);
      }, 1000);
    }
  };

  if (!colorObjetivo || !animalObjetivo) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error cargando nivel. Vuelve al inicio.</Text>
      </View>
    );
  }

  return (
    <ScreenBackground
      source={require('../../assets/images/backgrounds/home-background.jpeg')}
    >
      <View style={styles.container}>
        {/* Encabezado */}
        <View style={styles.header}>
          <AnimatedButton
            onPress={() => navigation.navigate(SCREENS.HOME)}
            style={styles.iconButton}
          >
            <Text style={styles.headerIcon}>🏠</Text>
          </AnimatedButton>

          <Text style={styles.levelText}>Nivel {level}</Text>

          <View style={styles.starsContainer}>
            <Text style={styles.starsText}>⭐ {stars}</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Banner del color pedido */}
          <View style={styles.promptBanner}>
            <AnimatedButton
              onPress={handleReplayAudio}
              style={styles.speakerButton}
            >
              <Text style={styles.speakerIcon}>🔊</Text>
            </AnimatedButton>

            <Text style={styles.promptText}>
              Toca el animal{' '}
              <Text style={{ color: colorObjetivo.hex }}>
                {colorObjetivo.label}
              </Text>
            </Text>
          </View>

          {/* Grid de animales */}
          <View style={styles.animalsGrid}>
            {animalesDelNivel.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onPress={handleAnimalPress}
                feedbackState={pressedId === animal.id ? feedback : null}
              />
            ))}
          </View>
        </ScrollView>

        {/* Feedback */}
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
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  headerIcon: {
    fontSize: 24,
  },
  levelText: {
    fontSize: FONT_SIZES.body,
    fontWeight: '700',
    color: PALETTE.textDark,
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  starsContainer: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  speakerButton: {
    backgroundColor: PALETTE.skyBlue,
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  speakerIcon: {
    fontSize: 20,
  },
  promptText: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '700',
    color: PALETTE.textDark,
    flex: 1,
  },
  animalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: GRID_GAP,
  },
  cardShadowWrapper: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  animalCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalCardImage: {
    resizeMode: 'contain',
  },
  animalImage: {
    // El animal debe caber dentro del hueco interior de la caja,
    // que es más pequeño que el cuadro completo por el marco de madera.
    width: '70%',
    height: '70%',
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