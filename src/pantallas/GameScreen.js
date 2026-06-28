/**
 * GameScreen.js
 * -----------------------------------------------------------------------
 * Pantalla principal del juego: muestra los animales, el color pedido,
 * y valida si el niño toca el animal correcto.
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
import ScreenBackground from '../components/common/ScreenBackground';

const TOTAL_LEVELS = 3;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GRID_HORIZONTAL_PADDING = 16 * 2;
const GRID_GAP = 16;
const COLUMNS = 2;
const MAX_CARD_SIZE = 170;

const availableWidth = SCREEN_WIDTH - GRID_HORIZONTAL_PADDING - GRID_GAP;
const calculatedCardSize = availableWidth / COLUMNS;
const CARD_SIZE = Math.min(calculatedCardSize, MAX_CARD_SIZE);

export default function GameScreen({ route, navigation }) {
  const level = route.params?.level ?? 1;

  const [targetColorId] = useState(
    ANIMALS_LIST[Math.floor(Math.random() * ANIMALS_LIST.length)].colorId
  );

  const [stars, setStars] = useState(12);
  const [feedback, setFeedback] = useState(null);

  const targetColor = getColorById(targetColorId);

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

  useEffect(() => {
    playSound(targetColor.audio);

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
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

      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  return (
    <ScreenBackground
      source={require('../../assets/images/backgrounds/home-background.jpeg')}
    >
      <View style={styles.container}>

        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate(SCREENS.HOME)}>
            <Text style={styles.headerIcon}>🏠</Text>
          </TouchableOpacity>

          <Text style={styles.levelText}>
            Nivel {level}
          </Text>

          <Text style={styles.starsText}>
            ⭐ {stars}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* Banner */}
          <View style={styles.promptBanner}>

            <TouchableOpacity
              onPress={handleReplayAudio}
              style={styles.speakerButton}
            >
              <Text style={styles.speakerIcon}>🔊</Text>
            </TouchableOpacity>

            <Text style={styles.promptText}>
              Toca el animal{' '}
              <Text style={{ color: targetColor.hex }}>
                {targetColor.label}
              </Text>
            </Text>

          </View>

          {/* Animales */}

          <View style={styles.animalsGrid}>

            {ANIMALS_LIST.map((animal) => (

              <TouchableOpacity
                key={animal.id}
                style={styles.animalCard}
                activeOpacity={0.8}
                onPress={() => handleAnimalPress(animal)}
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

        {feedback === 'correct' && (
          <View
            style={[
              styles.feedbackBanner,
              { backgroundColor: PALETTE.success },
            ]}
          >
            <Text style={styles.feedbackText}>
              ¡Correcto! 🎉
            </Text>
          </View>
        )}

        {feedback === 'wrong' && (
          <View
            style={[
              styles.feedbackBanner,
              { backgroundColor: PALETTE.error },
            ]}
          >
            <Text style={styles.feedbackText}>
              ¡Intenta de nuevo! 💪
            </Text>
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
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
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
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
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